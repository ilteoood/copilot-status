import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import { GITHUB_OAUTH_CONFIG } from '@/constants/api';

WebBrowser.maybeCompleteAuthSession();

// Get credentials from app config
const getCredentials = () => {
  const extra = Constants.expoConfig?.extra;
  return {
    clientId: extra?.githubClientId ?? '',
    clientSecret: extra?.githubClientSecret ?? '',
  };
};

// Create redirect URI
const getRedirectUri = () => AuthSession.makeRedirectUri()

// Discovery document for GitHub OAuth
const discovery: AuthSession.DiscoveryDocument = {
  authorizationEndpoint: GITHUB_OAUTH_CONFIG.authorizationEndpoint,
  tokenEndpoint: GITHUB_OAUTH_CONFIG.tokenEndpoint,
};

// Sign in with GitHub - returns auth request for use with promptAsync
export function useGitHubAuthRequest() {
  const { clientId } = getCredentials();
  const redirectUri = getRedirectUri();

  return AuthSession.useAuthRequest(
    {
      clientId,
      scopes: GITHUB_OAUTH_CONFIG.scopes,
      redirectUri,
    },
    discovery
  );
}

// Exchange authorization code for access token
export async function exchangeCodeForToken(code: string, codeVerifier?: string): Promise<string> {
  const { clientId, clientSecret } = getCredentials();
  const redirectUri = getRedirectUri();

  const body: Record<string, string> = {
    client_id: clientId,
    client_secret: clientSecret,
    code,
    redirect_uri: redirectUri,
  };

  if (codeVerifier) {
    body.code_verifier = codeVerifier;
  }

  const response = await fetch(GITHUB_OAUTH_CONFIG.tokenEndpoint, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error_description || data.error);
  }

  return data.access_token;
}
