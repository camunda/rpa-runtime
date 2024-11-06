import requests
import json
import os


class SecretsManager:

    def __init__(
        self,
        base_url="https://cluster-api.cloud.camunda.io/secrets",
        client_id=None,
        client_secret=None,
    ):
        self.base_url = base_url
        self.client_id = client_id or os.getenv("ZEEBE_CLIENT_ID")
        self.client_secret = client_secret or os.getenv("ZEEBE_CLIENT_SECRET")
        self.cache = {}  # Simple dictionary for caching secrets
        self.token_url = "https://login.cloud.camunda.io/oauth/token"
        self.token = None

    def _get_oauth_token(self):
        """Retrieve OAuth token for authentication."""
        payload = {
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "audience": "secrets.camunda.io",
            "grant_type": "client_credentials",
        }
        headers = {"content-type": "application/json"}

        response = requests.post(
            self.token_url, data=json.dumps(payload), headers=headers
        )

        if response.status_code == 200:
            self.token = response.json()["access_token"]
            print("Access token retrieved successfully.")
        else:
            response.raise_for_status()

    def _fetch_secrets(self):
        """Fetch secrets from the endpoint and return them, using the OAuth token for authentication."""
        # Ensure we have a valid token before making the request
        if not self.token:
            self._get_oauth_token()

        url = f"{self.base_url}"
        headers = {"Authorization": f"Bearer {self.token}"}
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()

    def get_secrets(self):
        """Get secrets, using the cache if available."""
        if self.cache:
            print("Using cached secrets.")
            return self.cache

        try:
            secrets = self._fetch_secrets()
        except Exception as e:
            print(f"Failed to fetch secrets: {e}")
            print(f"Ensure the client ID and secret have the Scope `Secrets`.")
            secrets = {}
        self.cache = secrets
        return secrets
