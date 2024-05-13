import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

// const jwksUrl = 'https://${domain}/.well-known/jwks.json'
const logger = createLogger('auth')
const certificate = `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJeXIDal4QnCrQMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi12eW5pMHZsM2V4Z3BiMmVuLnVzLmF1dGgwLmNvbTAeFw0yNDA1MDgw
OTQ1MzNaFw0zODAxMTUwOTQ1MzNaMCwxKjAoBgNVBAMTIWRldi12eW5pMHZsM2V4
Z3BiMmVuLnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBAMngHPwd2gkT+jnQmGnk/Rb8qr1D0dit5iEev2G9ZnduiqgjVtpb+2nRoVOL
WXkG4tMOkxYQHwWeAQAscntZ5PSMWYVDl2E900CFmPMwwp7xKnZRt439lgL3EyNf
R45NMqoD/Wl/NmCaFkQ9KiMqkPJ7LUZlUZ8DlHIrPZw3UyeD0VXuSB2M007NCXt5
5iiFrfOr9lHF5etee1UhxM7/LKrddHv61q+eZL9kayzWASbrcjQ/e9E34TQYo/sE
p6Ybm0sJEmkGJjCJ4cdzJlfT2c4hdlr0QznN4HaYoxwy7rNmHa90bh7JrnrsoA7h
n+47wWcKIE7+7FrfNiequf80aCcCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQUxGIP3IT86lizxeMkTauwJf+MeEAwDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQC/SFVxWLs+BDA4j7jxe60uIRVGN3clMXqML8Bd2uro
7idT83NVnOFtMQNvF6TbqcySGcP3opY0e0cB81sCdnj+kIBFqESq4M/8ehKlZ9Ms
weSzOpvFyPPMLd9BQ+YHJBygOc+oCxbssDnJF4Ke5rmvo8BaxVuJuH00Syag5qcI
nCheqaGUky3doHMbRz2lTk70f5lXAlf5pyuLj82Iy6K3iZB9stGiMpNoBZRK4Sw7
0NuYI/apuVir0TSyaKhXVmLU0OcLI7upPORC9k1LI6oRuWEX5EFRcykgnyqUc/3Y
vs3WaxRrMMgKv25oBmYxb9dRJc+65+tSy+lA24ceovzp
-----END CERTIFICATE-----`;

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    logger.info('User was authenticated', {
      userId: jwtToken.sub
    })

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  const jwt = jsonwebtoken.decode(token, { complete: true })

  // TODO: Implement token verification
  try {
    jsonwebtoken.verify(token, certificate, { algorithms: ['RS256'] });
  } catch(err) {
    console.log('Token verification failed')
  }
  return jwt;
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
