# Payment and Agent APIs Integration Guide

This guide explains how to use the Payment and Agent API services in the frontend application.

## API Services

The following new services have been added:

1. **Payment Service**: Handles all payment-related operations (device registration payments, payment verification, transaction history)
2. **Agent Service**: Handles all agent-specific operations (registering devices for users, wallet management, etc.)

## Using the Services

### Setting up imports

```typescript
// For Payment Service
import PaymentService from '../services/payment.service';

// For Agent Service
import AgentService from '../services/agent.service';
```

### Payment Service Examples

#### Initialize a payment for device registration

```typescript
const initializePayment = async (deviceId: string) => {
  try {
    const response = await PaymentService.initializeDeviceRegistrationPayment({
      deviceId,
      currency: 'NGN'
    });
    
    if (response.data.success) {
      // Redirect to the payment gateway
      window.location.href = response.data.data.authorizationUrl;
    }
  } catch (error) {
    console.error('Payment initialization failed', error);
  }
};
```

#### Verify a payment

```typescript
const verifyPayment = async (reference: string) => {
  try {
    const response = await PaymentService.verifyPayment(reference);
    
    if (response.data.success && response.data.data.status === 'SUCCESS') {
      // Payment was successful
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Payment verification failed', error);
    return false;
  }
};
```

#### Get user's transaction history

```typescript
const getTransactions = async (page = 1, limit = 10) => {
  try {
    const response = await PaymentService.getTransactions(page, limit);
    
    if (response.data.success) {
      return response.data.data.transactions;
    }
    
    return [];
  } catch (error) {
    console.error('Failed to get transactions', error);
    return [];
  }
};
```

### Agent Service Examples

#### Register a device for a user

```typescript
const registerDeviceForUser = async (deviceData) => {
  try {
    const response = await AgentService.registerDeviceForUser({
      userEmail: deviceData.email,
      userPhone: deviceData.phone,
      imei1: deviceData.imei,
      deviceName: deviceData.name,
      deviceBrand: deviceData.brand,
      deviceModel: deviceData.model,
      deviceCondition: deviceData.condition,
      deviceOs: deviceData.os
    });
    
    if (response.data.success) {
      // Device registered successfully
      return response.data.data;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to register device', error);
    return null;
  }
};
```

#### Agent payment for device registration

```typescript
const agentPayment = async (deviceId, userEmail, userPhone) => {
  try {
    const response = await AgentService.deviceRegistrationPayment({
      deviceId,
      userEmail,
      userPhone,
      payFromBalance: true // Pay from agent's wallet balance
    });
    
    if (response.data.success) {
      return response.data.data;
    }
    
    return null;
  } catch (error) {
    console.error('Agent payment failed', error);
    return null;
  }
};
```

#### Fund agent's wallet

```typescript
const fundWallet = async (amount) => {
  try {
    const response = await AgentService.fundWallet({
      amount,
      currency: 'NGN'
    });
    
    if (response.data.success) {
      // Redirect to payment gateway
      window.location.href = response.data.data.authorizationUrl;
    }
  } catch (error) {
    console.error('Wallet funding failed', error);
  }
};
```


#### Get agent's registration statistics

```typescript
const getRegistrationStats = async () => {
  try {
    const response = await AgentService.getRegistrationStats();
    
    if (response.data.success) {
      return response.data.data;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to get registration stats', error);
    return null;
  }
};
```

## Handling Payment Flow

1. **User Payment Flow**:
   - User selects a device to register
   - Initialize payment using `PaymentService.initializeDeviceRegistrationPayment`
   - Redirect user to Paystack payment page
   - Handle callback using `PaymentService.verifyPayment`

2. **Agent Payment Flow**:
   - Agent registers device for user using `AgentService.registerDeviceForUser`
   - Process payment using `AgentService.deviceRegistrationPayment`
   - If agent has insufficient wallet balance, they need to fund wallet first using `AgentService.fundWallet`

## Example Components

We've provided two example components to demonstrate these APIs:

1. `PaymentProcessing.tsx`: Shows how to handle user payments
2. `AgentDashboard.tsx`: Shows how to implement agent-specific functionality

You can use these as reference implementations for integrating the APIs into your components.
