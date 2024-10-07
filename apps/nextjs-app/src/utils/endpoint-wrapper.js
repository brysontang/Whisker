import { NextResponse } from 'next/server';
import client from './db';

export function endpointWrapper(handler) {
  return async (request, ...args) => {
    try {
      // Connect to the database if not already connected
      if (!client.topology || !client.topology.isConnected()) {
        await client.connect();
      }

      // TODO: Add authentication check here
      // const isAuthenticated = await checkAuthentication(request);
      // if (!isAuthenticated) {
      //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      // }

      // Call the original handler and pass the database client
      const db = client.db(process.env.MONGODB_DB);
      const result = await handler(request, db, ...args);

      // If the result is not a NextResponse, wrap it
      const response =
        result instanceof NextResponse ? result : NextResponse.json(result);

      // Set CORS headers
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS'
      );
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

      return response;
    } catch (error) {
      console.error('Endpoint operation failed:', error);
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
    }
    // Remove the finally block as we don't want to close the connection after each request
  };
}
