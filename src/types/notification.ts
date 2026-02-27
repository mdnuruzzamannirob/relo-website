// Notification types
export type NotificationType =
  | 'ORDER_PICKUP'
  | 'ORDER_PLACED'
  | 'SHIPPING'
  | 'COMPLETED'
  | 'REMINDER'
  | 'OFFER'
  | 'PAYMENT'
  | 'NEW_SERVICE'
  | string;

export interface NotificationSender {
  id: string;
  name: string;
  profileImage?: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  postId?: string;
  sender?: NotificationSender;
}

export interface NotificationMeta {
  total: number;
  page: number;
  limit: number;
  totalPage: number;
}

export interface NotificationListResponse {
  success: boolean;
  message: string;
  data: {
    meta: NotificationMeta;
    result: Notification[];
  };
}

export interface NotificationsParams {
  page?: number;
  limit?: number;
}

// Overview types
export interface BuyerOverviewStats {
  activeOrders: number;
  completedOrders: number;
  awaitOrders: number;
}

export interface SellerOverviewStats {
  totalEarning: number;
  activeProducts: number;
  pendingOrders: number;
  productSold: number;
  availableWithdrawal: number;
}

export interface DashboardStatsResponse {
  success: boolean;
  message: string;
  data: {
    isUserBuyer: boolean;
    buyerResponse: BuyerOverviewStats;
    sellerResponse: SellerOverviewStats;
  };
}

// Overview types
export interface BuyerOverviewStats {
  totalAmount: number;
  completedOrders: number;
  activeOrders: number;
  pendingReviews: number;
}

export interface SellerOverviewStats {
  totalEarnings: number;
  activeListings: number;
  pendingOrders: number;
  totalSold: number;
  availableToWithdraw: number;
}

export interface MyOverviewResponse {
  success: boolean;
  message: string;
  data: {
    totalOrders: boolean;
    buyerResponse: {
      totalAmount: number;
      completedOrders: number;
      activeOrders: number;
      pendingReviews: number;
      recentOrders: Array<{
        id: string;
        orderId: string;
        amount: number;
        status: string;
        products: {
          id: string;
          title: string;
          photos: string[];
          price: number;
        };
        seller?: {
          id: string;
          name: string;
          profileImage?: string;
        };
        createdAt: string;
      }>;
      unreadNotifications: number;
    }[];
    sellerResponse: {
      totalEarnings: number;
      activeListings: number;
      pendingOrders: number;
      totalSold: number;
      availableToWithdraw: number;
      recentOrders: Array<{
        id: string;
        orderId: string;
        amount: number;
        status: string;
        products: {
          id: string;
          title: string;
          photos: string[];
          price: number;
        };
        buyer?: {
          id: string;
          name: string;
          profileImage?: string;
        };
        createdAt: string;
      }>;
      recentActivity: Array<{
        id: string;
        type: string;
        title: string;
        description: string;
        timestamp: string;
      }>;
    }[];
  };
}
