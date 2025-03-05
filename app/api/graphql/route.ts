// Next.js Custom Route Handler: https://nextjs.org/docs/app/building-your-application/routing/router-handlers
// with type safety
import { createSchema, createYoga } from 'graphql-yoga'
import { typeDefs } from './schema'
import { resolvers } from './resolvers'
import { NextRequest } from 'next/server'

interface GraphQLContext {
    isInternalRequest: boolean;
    headers: Headers;
    resolvers: typeof resolvers;
}

const { handleRequest } = createYoga<{ request: NextRequest }>({
    context: ({ request }): GraphQLContext => {
        const isInternalRequest =
            request.headers.get('x-internal-request') === process.env.INTERNAL_API_REQUEST_SECRET;
        return {
            isInternalRequest,
            headers: request.headers,
            resolvers
        };
    },
    schema: createSchema({
        typeDefs,
        resolvers
    }),
    graphqlEndpoint: '/api/graphql',
    fetchAPI: { Response }
})

export { handleRequest as GET, handleRequest as POST, handleRequest as OPTIONS }