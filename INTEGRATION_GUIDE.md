# Integration Guide

This dashboard is designed to be a clean, empty slate ready for your data integrations. All placeholder data has been removed to ensure zero computing waste on fake data.

## Dashboard State

The admin dashboard is now **completely empty** and ready for integration with real data sources. All widgets display clear "Connect data source" messages instead of placeholder data.

## Security

Authentication middleware has been added to protect admin routes:
- `/admin/*` - Main dashboard
- `/analytics/*` - Analytics pages  
- `/agents/*` - AI agents pages

### Current Security Implementation

The middleware (`middleware.js`) checks for authentication tokens via:
- Cookie: `auth-token`
- Header: `authorization`

When authentication is missing, it sets the `X-Auth-Required: true` header.

### To Implement Full Authentication

1. Integrate with your authentication provider (e.g., NextAuth, Auth0, Clerk)
2. Update `middleware.js` to redirect unauthenticated users to login page
3. Or return 401 Unauthorized for API-style protection

Example for redirect:
```javascript
if (!authToken && !authHeader) {
  return NextResponse.redirect(new URL('/login', request.url));
}
```

## Data Integration Points

### Available Integration Registry

The system uses a flexible integration registry (`lib/data/sources.js`) that allows you to connect multiple data sources.

**Current registered integrations:**
- `analytics-api` - Analytics API Integration
- `agents-api` - Agents API Integration

### How to Add Your Data Source

1. **Update API Routes** (Recommended approach):
   
   Edit `/app/api/analytics/route.js` to fetch from your actual data source:
   ```javascript
   export async function GET() {
     // Connect to your analytics platform
     const data = await yourAnalyticsPlatform.fetchMetrics();
     
     return Response.json({
       metrics: {
         revenue: data.revenue,
         activeUsers: data.activeUsers,
         conversion: data.conversion,
         churn: data.churn,
       },
       breakdowns: {
         channels: data.channels,
         segments: data.segments,
       },
     });
   }
   ```

2. **Register Custom Integration**:

   Add new data sources to `lib/data/sources.js`:
   ```javascript
   coreRegistry.register(
     new DataSource("my-crm", "My CRM Integration", async () => {
       const res = await fetch("https://api.mycrm.com/data", {
         headers: { Authorization: `Bearer ${process.env.CRM_API_KEY}` }
       });
       return res.json();
     })
   );
   ```

3. **Use in Components**:

   Consume the integrated data in your dashboard components using SWR or other data fetching methods.

## Dashboard Components

All dashboard widgets in `components/dashboard/DashboardGrid.jsx` are now empty and ready for integration:

- **KPI Cards**: Revenue, Active Users, Conversion, Churn
- **Charts**: Traffic (line chart), Revenue by Channel (bar chart), User Segments (pie chart)
- **Table**: Top Accounts

### To Populate Dashboard

Update `DashboardGrid.jsx` to fetch and display real data:

```javascript
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function DashboardGrid() {
  const { data } = useSWR('/api/analytics', fetcher);
  
  // Use data.metrics.revenue, data.breakdowns, etc.
}
```

## Environment Variables

Add your integration API keys and secrets to `.env.local`:

```bash
# Analytics Platform
ANALYTICS_API_KEY=your_key_here

# CRM Integration
CRM_API_KEY=your_key_here
CRM_API_URL=https://api.yourcrm.com

# Authentication
AUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000
```

## Testing Your Integration

1. Start the dev server: `npm run dev`
2. Navigate to `/admin`
3. Check the "Integration Setup" section at the bottom of the page
4. Verify your API responses are no longer empty
5. Confirm widgets display real data

## Next Steps

1. ✅ Remove placeholder data - **COMPLETE**
2. ✅ Add security middleware - **COMPLETE**  
3. ⬜ Implement authentication provider
4. ⬜ Connect real data sources
5. ⬜ Configure environment variables
6. ⬜ Test integrations
7. ⬜ Deploy to production

## Support

For integration assistance, refer to:
- Next.js documentation: https://nextjs.org/docs
- Data fetching with SWR: https://swr.vercel.app
- Authentication: https://next-auth.js.org
