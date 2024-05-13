import jsonwebtoken from 'jsonwebtoken'
import {createLogger} from '../../logger/LoggerUtils.mjs'

// const jwksUrl = 'https://${domain}/.well-known/jwks.json'
const logger = createLogger('auth')
const certificate = process.env.AUTH0_CERTIFICATE;

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
        logger.error('User not authorized', {error: e.message})

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
    const jwt = jsonwebtoken.decode(token, {complete: true})

    // TODO: Implement token verification
    try {
        jsonwebtoken.verify(token, certificate, {algorithms: ['RS256']});
    } catch (err) {
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
