interface ICustomer {
  getIdentifier(): string;

  getAddress(): string;

  hasPremiumSubscription(): boolean;
}

type OrderRawData = {
  id?: string,
  customer: ICustomer,
  productIds: string[]
}

interface IOrder {
  getProductIds(): string[];

  getCustomerId(): string;

  getDeliveryDays(): number;
}

class StandardOrder implements IOrder {
  private _id: string | undefined;
  private _customerId: string;
  private _customerAddress: string;
  private _hasPriority: boolean;
  private _productIds: string[];

  constructor(
    orderData: OrderRawData
  ) {
    const { id, customer, productIds } = orderData;
    this._id = id;
    this._customerId = customer.getIdentifier();
    this._customerAddress = customer.getAddress();
    this._productIds = productIds;
    this._hasPriority = customer.hasPremiumSubscription();
  }

  getProductIds() {
    return this._productIds;
  }

  getCustomerId() {
    return this._customerId;
  }

  getDeliveryDays(): number {
    return 3;
  }
}



class PremiumOrder implements IOrder {
  private _id: string | undefined;
  private _customerId: string;
  private _customerAddress: string;
  private _hasPriority: boolean;
  private _productIds: string[];

  constructor(
    orderData: OrderRawData
  ) {
    const { id, customer, productIds } = orderData;
    this._id = id;
    this._customerId = customer.getIdentifier();
    this._customerAddress = customer.getAddress();
    this._productIds = productIds;
    this._hasPriority = customer.hasPremiumSubscription();
  }

  getProductIds() {
    return this._productIds;
  }

  getCustomerId() {
    return this._customerId;
  }

  getDeliveryDays(): number {
    return 1;
  }
}


const printDeliveryDays = (order: IOrder) => console.log(order.getDeliveryDays());

// Priority orders have 1 day
class Customer implements ICustomer {
  private _id: string;
  private _address: string;
  private _subscriptionType: 'premium' | 'standard';

  constructor(id: string, address: string, subscriptionType: 'premium' | 'standard') {
    this._id = id;
    this._address = address;
    this._subscriptionType = subscriptionType;
  }

  getIdentifier(): string {
    return this._id;
  }

  getAddress(): string {
    return this._address;
  }

  hasPremiumSubscription(): boolean {
    return this._subscriptionType == 'premium';
  }
}

const orderFactory = (orderRawData: OrderRawData): IOrder => {
  if (orderRawData.customer.hasPremiumSubscription()) {
    return new PremiumOrder(orderRawData);
  } else {
    return new StandardOrder(orderRawData);
  }
}

const standard = orderFactory({
  customer: new Customer("1", "address", 'standard'),
  productIds: []
});

const premium = orderFactory({
  customer: new Customer("1", "address", 'premium'),
  productIds: []
});

printDeliveryDays(standard)
printDeliveryDays(premium)

export {};
