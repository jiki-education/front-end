# Rails API Changes Checklist for LLM Chat Feature

This document outlines the changes needed in the Rails API repository (`jiki/api`) to support the LLM chat proxy.

**⚠️ IMPORTANT**: These changes must be made in the Rails repository, NOT in this frontend repository.

---

## 1. Generate Internal API Secret

Create a new shared secret for internal API communication between the proxy and Rails:

```bash
# Generate a secure random secret
openssl rand -hex 32

# Add to Rails credentials
cd /path/to/jiki/api
EDITOR=vim rails credentials:edit

# Add this line:
internal_api_secret: "paste-your-generated-secret-here"
```

**Save this secret** - you'll need it for Cloudflare Workers configuration.

---

## 2. Create Internal API Infrastructure

### Base Controller

Create `app/controllers/api/internal/base_controller.rb`:

```ruby
module Api
  module Internal
    class BaseController < ApplicationController
      skip_before_action :authenticate_user!
      before_action :validate_internal_request

      private

      def validate_internal_request
        secret = request.headers['X-Internal-Secret']
        expected_secret = Rails.application.credentials.internal_api_secret

        unless ActiveSupport::SecurityUtils.secure_compare(secret.to_s, expected_secret.to_s)
          render json: { error: 'Unauthorized' }, status: :unauthorized
        end
      end
    end
  end
end
```

---

## 3. Create LLM Conversation Model

### Migration

Create migration:

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
      t.string :role, null: false
      t.text :content, null: false
      t.integer :tokens_used, default: 0
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

### Model

Create `app/models/llm_conversation.rb`:

```ruby
class LlmConversation < ApplicationRecord
  belongs_to :user

  validates :role, presence: true, inclusion: { in: %w[user assistant] }
  validates :content, presence: true
  validates :exercise_slug, presence: true
  validates :tokens_used, numericality: { greater_than_or_equal_to: 0 }
end
```

---

## 4. Create Conversations Controller

Create `app/controllers/api/internal/llm/conversations_controller.rb`:

```ruby
module Api
  module Internal
    module Llm
      class ConversationsController < Api::Internal::BaseController
        def create
          user = User.find(params[:user_id])
          exercise_slug = params[:exercise_slug]
          messages = params[:messages]

          messages.each do |message|
            LlmConversation.create!(
              user: user,
              exercise_slug: exercise_slug,
              role: message[:role],
              content: message[:content],
              tokens_used: message[:tokens],
              created_at: params[:timestamp] || Time.current
            )
          end

          head :created
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'User not found' }, status: :not_found
        rescue ActiveRecord::RecordInvalid => e
          render json: { error: e.message }, status: :unprocessable_entity
        end
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
  namespace :internal do
    namespace :llm do
      resources :conversations, only: [:create]
    end
  end
end
```

---

## 6. Deploy Secrets to Cloudflare Workers

After setting up Rails, copy secrets to Cloudflare Workers:

### Copy JWT Secret from Rails

```bash
# In Rails repo
cd /path/to/jiki/api
EDITOR=vim rails credentials:edit

# Copy the value of: devise_jwt_secret_key
```

### Set in Cloudflare Workers

```bash
# In frontend repo
cd /path/to/jiki/front-end/llm-chat-proxy

# Set JWT secret (MUST match Rails exactly!)
wrangler secret put DEVISE_JWT_SECRET_KEY
# Paste the JWT secret from Rails

# Set internal API secret (same one from Rails credentials)
wrangler secret put INTERNAL_API_SECRET
# Paste the internal_api_secret

# Set Rails API URL
wrangler secret put RAILS_API_URL
# Development: http://localhost:3061
# Production: https://api.jiki.app

# Set Gemini API key
wrangler secret put GOOGLE_GEMINI_API_KEY
# Get from: https://aistudio.google.com/apikey
```

---

## 7. Testing

### Test Internal API Endpoint

```bash
# In Rails console
rails console

# Test creating a conversation
internal_secret = Rails.application.credentials.internal_api_secret

# Use curl or similar
curl -X POST http://localhost:3061/api/internal/llm/conversations \
  -H "Content-Type: application/json" \
  -H "X-Internal-Secret: $internal_secret" \
  -d '{
    "user_id": 1,
    "exercise_slug": "basic-movement",
    "messages": [
      {
        "role": "user",
        "content": "How do I solve this?",
        "tokens": 10
      },
      {
        "role": "assistant",
        "content": "Try breaking it down step by step...",
        "tokens": 20
      }
    ],
    "timestamp": "2025-10-31T00:00:00Z"
  }'
```

Expected response: `201 Created` with empty body

---

## 8. Verification Checklist

- [ ] Internal API secret generated and added to Rails credentials
- [ ] Base controller created with secret validation
- [ ] Migration created and run successfully
- [ ] LlmConversation model created with validations
- [ ] Conversations controller created
- [ ] Routes added
- [ ] JWT secret copied from Rails to Cloudflare Workers (EXACT match!)
- [ ] Internal API secret added to Cloudflare Workers (same as Rails)
- [ ] Rails API URL set in Cloudflare Workers
- [ ] Gemini API key set in Cloudflare Workers
- [ ] Internal API endpoint tested successfully

---

## Security Notes

1. **Never commit secrets**: All secrets should be in Rails credentials and Cloudflare secrets
2. **JWT secret MUST match**: Any mismatch causes authentication failures
3. **Internal API is protected**: X-Internal-Secret header required
4. **Validate all inputs**: Controller validates user existence and message format

---

## Troubleshooting

### "Unauthorized" from internal API
- Check X-Internal-Secret header matches Rails credentials
- Verify secret comparison is using secure_compare

### Conversations not saving
- Check Rails logs for errors
- Verify user_id exists
- Check timestamps are valid ISO8601 format

### JWT authentication fails
- Verify DEVISE_JWT_SECRET_KEY in Workers matches Rails exactly
- Check token hasn't expired
- Verify token format is valid

---

## Next Steps

After completing these changes:

1. Deploy Rails changes to staging/production
2. Deploy llm-chat-proxy to Cloudflare Workers
3. Test end-to-end flow
4. Monitor for errors in both Rails and Workers logs
5. Implement frontend integration (ChatPanel component)
