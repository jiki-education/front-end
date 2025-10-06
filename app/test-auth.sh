#!/bin/bash

# Test Rails Auth Endpoints
API_URL="http://localhost:3061/v1"

echo "Testing Rails Auth API"
echo "====================="

# Test login
echo -e "\n1. Testing Login..."
response=$(curl -s -i -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"user":{"email":"test@example.com","password":"password123"}}')

echo "Response Headers:"
echo "$response" | head -20

echo -e "\nResponse Body:"
echo "$response" | tail -n 1 | jq '.'

# Extract token if it's in the body
token=$(echo "$response" | tail -n 1 | jq -r '.token // .jwt // .access_token // empty')

if [ -z "$token" ]; then
  echo "No token found in response body. Checking headers..."
  # Try to extract from Authorization header
  token=$(echo "$response" | grep -i "authorization:" | sed 's/.*Bearer //i')
fi

if [ ! -z "$token" ]; then
  echo -e "\nToken found: ${token:0:30}..."
  
  echo -e "\n2. Testing authenticated request to /v1/levels..."
  curl -s -X GET "$API_URL/levels" \
    -H "Authorization: Bearer $token" \
    -H "Content-Type: application/json" | jq '.'
else
  echo "No token found in response!"
fi
