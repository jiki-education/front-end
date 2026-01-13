# Rails API Changes Checklist for LLM Chat Feature

This document outlines the changes needed in the Rails API repository (`jiki/api`) to support the LLM chat proxy with HMAC signature verification.

**⚠️ IMPORTANT**: These changes must be made in the Rails repository, NOT in this frontend repository.

---

## Architecture Overview

**Flow:**
1. Frontend → llm-chat-proxy (with user's JWT)
2. llm-chat-proxy validates JWT, streams from Gemini
3. llm-chat-proxy signs response with HMAC and sends signature to frontend
4. Frontend receives response + signature
5. Frontend → Rails API (with JWT + response + signature)
6. Rails verifies signature and saves conversation

**Security:** HMAC signature prevents users from forging fake LLM responses.

---

## 1. Generate Shared Secret for HMAC

Create a shared secret for signing/verifying LLM responses:

```bash
# Generate a secure random secret
openssl rand -hex 32

# Add to Rails credentials
cd /path/to/jiki/api
EDITOR=vim rails credentials:edit

# Add this line:
llm_signature_secret: "paste-your-generated-secret-here"
```

**Save this secret** - you'll need it for Cloudflare Workers configuration.

---

## 2. Create Migration

```bash
rails generate migration CreateLlmConversations
```

Edit the migration file:

```ruby
class CreateLlmConversations < ActiveRecord::Migration[8.1]
  def change
    create_table :llm_conversations do |t|
      t.references :user, null: false, foreign_key: true
      t.string :exercise_slug, null: false
      t.text :user_message, null: false
      t.text :assistant_message, null: false
      t.integer :user_message_tokens, default: 0
      t.integer :assistant_message_tokens, default: 0
      t.timestamps
    end

    add_index :llm_conversations, [:user_id, :exercise_slug, :created_at]
    add_index :llm_conversations, :created_at
  end
end
```

Run migration:
```bash
rails db:migrate
```

---

## 3. Create Model

Create `app/models/llm_conversation.rb`:

```ruby
class LlmConversation < ApplicationRecord
  belongs_to :user

  validates :exercise_slug, presence: true
  validates :user_message, presence: true
  validates :assistant_message, presence: true
  validates :user_message_tokens, numericality: { greater_than_or_equal_to: 0 }
  validates :assistant_message_tokens, numericality: { greater_than_or_equal_to: 0 }
end
```

---

## 4. Create Controller with HMAC Verification

Create `app/controllers/api/llm/conversations_controller.rb`:

```ruby
module Api
  module Llm
    class ConversationsController < ApplicationController
      before_action :authenticate_user!

      def create
        # Verify HMAC signature
        unless verify_signature
          return render json: { error: 'Invalid signature' }, status: :unauthorized
        end

        conversation = current_user.llm_conversations.create!(
          exercise_slug: params[:exercise_slug],
          user_message: params[:user_message],
          assistant_message: params[:assistant_message],
          user_message_tokens: params[:user_message_tokens] || estimate_tokens(params[:user_message]),
          assistant_message_tokens: params[:assistant_message_tokens] || estimate_tokens(params[:assistant_message])
        )

        render json: { id: conversation.id }, status: :created
      rescue ActiveRecord::RecordInvalid => e
        render json: { error: e.message }, status: :unprocessable_entity
      end

      private

      def verify_signature
        signature = params[:signature]
        timestamp = params[:timestamp]

        return false if signature.blank? || timestamp.blank?

        # Optional: Reject if signature is older than 5 minutes (prevents replay attacks)
        begin
          sig_time = Time.iso8601(timestamp)
          return false if sig_time < 5.minutes.ago || sig_time > 1.minute.from_now
        rescue ArgumentError
          return false
        end

        # Reconstruct the signed payload (must match llm-chat-proxy exactly)
        payload = "#{current_user.id}:#{params[:exercise_slug]}:#{params[:assistant_message]}:#{timestamp}"

        secret = Rails.application.credentials.llm_signature_secret
        expected_signature = OpenSSL::HMAC.hexdigest('SHA256', secret, payload)

        ActiveSupport::SecurityUtils.secure_compare(signature, expected_signature)
      end

      def estimate_tokens(text)
        # Rough estimation: 4 chars ≈ 1 token
        (text.to_s.length / 4.0).ceil
      end
    end
  end
end
```

---

## 5. Add Routes

Edit `config/routes.rb`:

```ruby
namespace :api do
  namespace :llm do
    resources :conversations, only: [:create]
  end
end
```

---

## 6. Deploy Secrets to Cloudflare Workers

After setting up Rails, configure Cloudflare Workers:

### Copy Secrets from Rails

```bash
# In Rails repo
cd /path/to/jiki/api
EDITOR=vim rails credentials:edit

# You need:
# 1. devise_jwt_secret_key
# 2. llm_signature_secret (just created in step 1)
```

### Set in Cloudflare Workers

```bash
# In frontend repo
cd /path/to/jiki/front-end/llm-chat-proxy

# Set JWT secret (MUST match Rails exactly!)
wrangler secret put DEVISE_JWT_SECRET_KEY
# Paste the JWT secret from Rails

# Set HMAC signature secret (MUST match Rails exactly!)
wrangler secret put LLM_SIGNATURE_SECRET
# Paste the llm_signature_secret from Rails

# Set Gemini API key
wrangler secret put GOOGLE_GEMINI_API_KEY
# Get from: https://aistudio.google.com/apikey
```

---

## 7. Expected Request Format

The frontend will POST to `/api/llm/conversations`:

```json
{
  "exercise_slug": "maze-solve-basic",
  "user_message": "How do I solve this?",
  "assistant_message": "Try breaking it down step by step...",
  "user_message_tokens": 10,
  "assistant_message_tokens": 45,
  "timestamp": "2025-10-31T08:15:30.000Z",
  "signature": "a1b2c3d4e5f6..."
}
```

With headers:
- `Authorization: Bearer <user-jwt-token>`
- `Content-Type: application/json`

---

## 8. Testing

```ruby
# In Rails console
rails console

# Test signature generation
secret = Rails.application.credentials.llm_signature_secret
user_id = 1
exercise_slug = "test-exercise"
message = "This is a test response"
timestamp = Time.current.iso8601(3)  # Include milliseconds

payload = "#{user_id}:#{exercise_slug}:#{message}:#{timestamp}"
signature = OpenSSL::HMAC.hexdigest('SHA256', secret, payload)

puts "Signature: #{signature}"
puts "Timestamp: #{timestamp}"

# Test with curl (get a real JWT first)
# Replace YOUR_JWT_TOKEN, $timestamp, and $signature
```

Example curl:
```bash
curl -X POST http://localhost:3061/api/llm/conversations \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "exercise_slug": "test-exercise",
    "user_message": "How do I do this?",
    "assistant_message": "This is a test response",
    "user_message_tokens": 10,
    "assistant_message_tokens": 20,
    "timestamp": "2025-10-31T08:15:30.123Z",
    "signature": "generated_signature_here"
  }'
```

Expected response: `201 Created` with `{"id": 123}`

---

## 9. Verification Checklist

- [ ] Shared secret generated and added to Rails credentials
- [ ] Migration created and run successfully
- [ ] LlmConversation model created with validations
- [ ] Conversations controller created with HMAC verification
- [ ] Routes added
- [ ] JWT secret copied from Rails to Cloudflare Workers (EXACT match!)
- [ ] HMAC signature secret added to Cloudflare Workers (EXACT match!)
- [ ] Gemini API key set in Cloudflare Workers
- [ ] Endpoint tested successfully with valid signature
- [ ] Endpoint tested with invalid signature (should reject)

---

## 10. Security Notes

1. **Never commit secrets**: All secrets should be in Rails credentials and Cloudflare secrets
2. **JWT secret MUST match**: Any mismatch causes authentication failures
3. **Signature secret MUST match**: Any mismatch causes all saves to fail
4. **Signature payload format**: Must match exactly between Workers and Rails
5. **Timestamp validation**: Optional but recommended to prevent replay attacks
6. **Use secure_compare**: Prevents timing attacks on signature verification

---

## 11. Troubleshooting

### "Invalid signature" error
- Check LLM_SIGNATURE_SECRET in Workers matches Rails credentials exactly
- Verify payload format matches: `userId:exerciseSlug:assistantMessage:timestamp`
- Check timestamp format is ISO8601
- Ensure no extra whitespace in messages

### Conversations not saving
- Check Rails logs for errors
- Verify user_id from JWT exists
- Check timestamps are valid ISO8601 format
- Verify signature is hex-encoded (not base64)

### JWT authentication fails
- Verify DEVISE_JWT_SECRET_KEY in Workers matches Rails exactly
- Check token hasn't expired
- Verify token format is valid

---

## 12. Signature Payload Format

**CRITICAL**: The payload format must match exactly:

```
userId:exerciseSlug:assistantMessage:timestamp
```

Example:
```
123:maze-solve-basic:Try using the move_forward function:2025-10-31T08:15:30.123Z
```

This string is then signed with HMAC-SHA256 using the shared secret.

---

## 13. Next Steps

After completing these changes:

1. Deploy Rails changes to staging/production
2. Deploy llm-chat-proxy to Cloudflare Workers
3. Implement frontend integration (ChatPanel component)
4. Test end-to-end flow
5. Monitor for errors in both Rails and Workers logs
