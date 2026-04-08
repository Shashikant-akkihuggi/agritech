# Testing Guide

Comprehensive testing guide for Smart Agro Platform.

## Manual Testing Checklist

### Authentication Flow

#### Registration
- [ ] Navigate to `/auth/register`
- [ ] Fill in all fields (name, phone, password)
- [ ] Verify password confirmation works
- [ ] Submit form
- [ ] Check redirect to onboarding
- [ ] Verify user created in database

#### Login
- [ ] Navigate to `/auth/login`
- [ ] Enter valid credentials
- [ ] Verify redirect to dashboard
- [ ] Check token stored in localStorage
- [ ] Try invalid credentials (should fail)
- [ ] Verify error message displayed

#### Logout
- [ ] Click logout button
- [ ] Verify redirect to login
- [ ] Check token removed from storage
- [ ] Try accessing protected route (should redirect)

### Onboarding Flow

#### Step 1: Location
- [ ] Enter farm name
- [ ] Enter location
- [ ] Test GPS detection button
- [ ] Verify latitude/longitude populated
- [ ] Click Next

#### Step 2: Soil Type
- [ ] Select soil type (clay, loam, sandy, etc.)
- [ ] Verify selection highlighted
- [ ] Click Next

#### Step 3: Land Size
- [ ] Enter total area in acres
- [ ] Verify validation (positive number)
- [ ] Click Complete Setup
- [ ] Verify redirect to dashboard
- [ ] Check farm created in database

### Dashboard

#### Overview
- [ ] Verify stats cards display correctly
- [ ] Check water saved metric
- [ ] Check efficiency percentage
- [ ] Check revenue display
- [ ] Check active alerts count
- [ ] Verify recent activity list
- [ ] Test quick action buttons

#### Farm Selection
- [ ] Verify selected farm displayed
- [ ] Check farm details (name, location, area)
- [ ] If multiple farms, test switching

### Smart Irrigation

#### Decision Flow
- [ ] Navigate to Smart Irrigation
- [ ] Verify fields list displayed
- [ ] Click on a field
- [ ] Wait for decision calculation
- [ ] Verify decision card displayed with:
  - Clear action (IRRIGATE/DO_NOT_IRRIGATE/REDUCE)
  - Confidence percentage
  - Water amount or savings
  - Detailed reason
- [ ] Check "Why This Decision" section:
  - Soil moisture factor
  - Weather conditions
  - Crop requirements
- [ ] Verify decision color coding:
  - Green for IRRIGATE
  - Red for DO_NOT_IRRIGATE
  - Yellow for REDUCE_IRRIGATION

#### Edge Cases
- [ ] Test with no fields (should show message)
- [ ] Test with no farm selected
- [ ] Test with missing soil data
- [ ] Test with missing crop data

### Weather Dashboard

#### Current Weather
- [ ] Navigate to Weather
- [ ] Verify current temperature displayed
- [ ] Check weather condition
- [ ] Verify humidity, wind speed, pressure
- [ ] Check rain probability

#### Forecasts
- [ ] Verify hourly forecast (8 hours)
- [ ] Check 7-day forecast
- [ ] Verify temperature ranges
- [ ] Check rain probabilities

#### Impact Analysis
- [ ] Verify irrigation impact section
- [ ] Check alerts for:
  - High rain probability
  - High temperature
  - Low humidity
  - Favorable conditions

### Marketplace

#### Price Display
- [ ] Navigate to Marketplace
- [ ] Verify live mandi prices table
- [ ] Check all columns:
  - Commodity
  - Market
  - State
  - Min/Max/Modal prices
  - Trend indicator
- [ ] Test commodity filters
- [ ] Verify "All Commodities" filter

#### Statistics
- [ ] Check average market price
- [ ] Verify highest price display
- [ ] Check markets tracked count

#### Actions
- [ ] Test "Create Listing" button
- [ ] Verify call-to-action card

### Finance Module

#### Eligibility Check
- [ ] Navigate to Finance
- [ ] Verify eligibility card displayed
- [ ] Check eligibility status
- [ ] If eligible, verify:
  - Maximum loan amount
  - Interest rate
  - Total land area

#### Loan Application
- [ ] Enter loan amount
- [ ] Verify validation (max amount)
- [ ] Check calculation:
  - Loan amount
  - Interest calculation
  - Total repayment
- [ ] Review repayment terms
- [ ] Submit application
- [ ] Verify success message

#### Loan History
- [ ] Check loan history section
- [ ] Verify status badges (Pending, Repaid)
- [ ] Check loan details display

### Analytics Dashboard

#### Metrics
- [ ] Navigate to Analytics
- [ ] Verify stat cards:
  - Total water used
  - Water saved
  - Cost savings
  - Average efficiency
- [ ] Check percentage changes

#### Charts
- [ ] Verify water usage trends chart
- [ ] Check irrigation efficiency chart
- [ ] Verify crop yield analysis chart
- [ ] Test chart interactions (hover, tooltips)

#### Insights
- [ ] Check key insights section
- [ ] Verify recommendations section
- [ ] Ensure actionable advice displayed

### Farm Management

#### Farm Overview
- [ ] Navigate to Farm Management
- [ ] Verify farm stats:
  - Total area
  - Soil type
  - Active crops count
- [ ] Check farm location display
- [ ] Test "View on Map" button

#### Fields
- [ ] Verify fields overview
- [ ] Check field cards display:
  - Field name
  - Area
  - Crop type
  - Status
  - Planting date
- [ ] Test "Add Field" button

#### Health Monitoring
- [ ] Check soil health section:
  - Moisture level
  - pH level
  - Nitrogen
  - Phosphorus
- [ ] Verify crop health section:
  - Overall health
  - Growth stage
  - Disease risk
  - Pest activity

### Alerts System

#### Alert Display
- [ ] Navigate to Alerts
- [ ] Verify unread count
- [ ] Check alert cards display:
  - Icon based on type
  - Severity badge
  - Title and message
  - Timestamp
- [ ] Verify color coding by severity

#### Alert Actions
- [ ] Test "Mark as Read" button
- [ ] Test "Take Action" button
- [ ] Test filter buttons:
  - All Alerts
  - Unread Only
  - High Priority
  - Mark All as Read

#### Alert Settings
- [ ] Check alert settings section
- [ ] Test toggle switches:
  - Irrigation alerts
  - Weather alerts
  - Pest & disease alerts
  - Market price alerts

## API Testing

### Authentication Endpoints

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"phone":"1234567890","name":"Test User","password":"test123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"1234567890","password":"test123"}'
```

### Farm Endpoints

```bash
# Get farms (requires token)
curl http://localhost:3000/api/farms \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create farm
curl -X POST http://localhost:3000/api/farms \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Farm","location":"Test Location","latitude":18.5,"longitude":73.8,"totalArea":5,"soilType":"loam"}'
```

### Irrigation Endpoint

```bash
# Get irrigation decision
curl -X POST http://localhost:3000/api/irrigation/decision \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"fieldId":"FIELD_ID"}'
```

### Weather Endpoint

```bash
# Current weather
curl "http://localhost:3000/api/weather?lat=18.5&lon=73.8" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Forecast
curl "http://localhost:3000/api/weather?lat=18.5&lon=73.8&type=forecast" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Marketplace Endpoint

```bash
# Get prices
curl "http://localhost:3000/api/marketplace/prices" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Filter by commodity
curl "http://localhost:3000/api/marketplace/prices?commodity=Rice" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Finance Endpoint

```bash
# Check eligibility
curl -X POST http://localhost:3000/api/loans/eligibility \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Performance Testing

### Load Testing
```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Test login endpoint
ab -n 1000 -c 10 -p login.json -T application/json \
  http://localhost:3000/api/auth/login
```

### Database Performance
```sql
-- Check slow queries
SELECT * FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 10;

-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Security Testing

### Authentication
- [ ] Test JWT expiration
- [ ] Test invalid tokens
- [ ] Test missing authorization headers
- [ ] Verify password hashing (bcrypt)

### Authorization
- [ ] Test accessing other users' data
- [ ] Verify farm ownership checks
- [ ] Test field access permissions

### Input Validation
- [ ] Test SQL injection attempts
- [ ] Test XSS attempts
- [ ] Test invalid data types
- [ ] Test boundary values

## Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

## Responsive Design

Test on:
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

## Accessibility

- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast sufficient
- [ ] Focus indicators visible
- [ ] Alt text on images

## Known Issues

Document any known issues here:

1. Issue: Description
   - Impact: High/Medium/Low
   - Workaround: Steps to work around
   - Status: Open/In Progress/Fixed

## Test Data

### Demo Account
- Phone: 9876543210
- Password: demo123

### Test Scenarios
1. New user registration and onboarding
2. Existing user with multiple farms
3. User with no farms (edge case)
4. User with farms but no fields
5. User with complete data

## Reporting Bugs

When reporting bugs, include:
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Screenshots/videos
5. Browser/device info
6. Console errors
7. Network requests (if relevant)

## Success Criteria

All tests pass when:
- [ ] All manual tests completed
- [ ] All API endpoints return correct responses
- [ ] No console errors
- [ ] Performance metrics acceptable
- [ ] Security tests pass
- [ ] Cross-browser compatibility verified
- [ ] Responsive design works
- [ ] Accessibility standards met
