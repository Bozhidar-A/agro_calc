// Next.js Custom Route Handler: https://nextjs.org/docs/app/building-your-application/routing/router-handlers
import { createSchema, createYoga } from 'graphql-yoga'
import { typeDefs } from '@/app/api/graphql/schema'
import { resolvers } from '@/app/api/graphql/resolvers'

interface NextContext {
    params: Promise<Record<string, string>>
}

const { handleRequest } = createYoga<NextContext>({
    context: ({ request }) => {
        const isInternalRequest = request.headers.get('x-internal-request') === process.env.INTERNAL_API_REQUEST_SECRET;

        return {
            isInternalRequest, // Pass this flag to the resolvers
            headers: request.headers,
        };
    },

    schema: createSchema({
        typeDefs,
        resolvers
    }),

    // While using Next.js file convention for routing, we need to configure Yoga to use the correct endpoint
    graphqlEndpoint: '/api/graphql',

    // Yoga needs to know how to create a valid Next response
    fetchAPI: { Response }
})

export { handleRequest as GET, handleRequest as POST, handleRequest as OPTIONS }