#!/usr/bin/env bash

# Example script demonstrating the credential issuance API
# Requires: curl, jq (for JSON formatting)

API_URL="http://localhost:3000"

echo "========================================="
echo "Business Wallet API - Usage Examples"
echo "========================================="
echo ""

# 1. Health check
echo "1. Health Check"
echo "   GET $API_URL/health"
echo ""
curl -s "$API_URL/health" | jq '.'
echo ""
echo ""

# 2. Issue a credential
echo "2. Issue a Credential"
echo "   POST $API_URL/api/v1/credentials"
echo ""
CREDENTIAL_RESPONSE=$(curl -s -X POST "$API_URL/api/v1/credentials" \
  -H "Content-Type: application/json" \
  -d '{
    "issuer": "did:example:university123",
    "credentialSubject": {
      "id": "did:example:student456",
      "name": "Alice Smith",
      "degree": "Bachelor of Science",
      "graduationYear": 2024
    },
    "type": ["VerifiableCredential", "UniversityDegreeCredential"],
    "expirationDate": "2030-12-31T23:59:59Z"
  }')

echo "$CREDENTIAL_RESPONSE" | jq '.'
CREDENTIAL_ID=$(echo "$CREDENTIAL_RESPONSE" | jq -r '.id')
echo ""
echo "Created credential with ID: $CREDENTIAL_ID"
echo ""
echo ""

# 3. Retrieve the credential by ID
echo "3. Retrieve Credential by ID"
echo "   GET $API_URL/api/v1/credentials/$CREDENTIAL_ID"
echo ""
curl -s "$API_URL/api/v1/credentials/$CREDENTIAL_ID" | jq '.'
echo ""
echo ""

# 4. Issue another credential for the same holder
echo "4. Issue Another Credential (Employment)"
echo "   POST $API_URL/api/v1/credentials"
echo ""
curl -s -X POST "$API_URL/api/v1/credentials" \
  -H "Content-Type: application/json" \
  -d '{
    "issuer": "did:example:company789",
    "credentialSubject": {
      "id": "did:example:student456",
      "name": "Alice Smith",
      "position": "Software Engineer",
      "department": "Engineering"
    },
    "type": ["VerifiableCredential", "EmploymentCredential"]
  }' | jq '.'
echo ""
echo ""

# 5. Get all credentials for a holder
echo "5. Get All Credentials for Holder"
echo "   GET $API_URL/api/v1/credentials?holderId=did:example:student456"
echo ""
curl -s "$API_URL/api/v1/credentials?holderId=did:example:student456" | jq '.'
echo ""
echo ""

# 6. Get all credentials
echo "6. Get All Credentials"
echo "   GET $API_URL/api/v1/credentials"
echo ""
curl -s "$API_URL/api/v1/credentials" | jq 'length'
echo " credentials found"
echo ""

echo "========================================="
echo "Examples completed!"
echo "========================================="
