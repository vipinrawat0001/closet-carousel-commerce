export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      buy_order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string | null
          product_id: string | null
          product_name: string
          quantity: number
          size: Database["public"]["Enums"]["size_type"]
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id?: string | null
          product_id?: string | null
          product_name: string
          quantity: number
          size: Database["public"]["Enums"]["size_type"]
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string | null
          product_id?: string | null
          product_name?: string
          quantity?: number
          size?: Database["public"]["Enums"]["size_type"]
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "buy_order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "buy_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "buy_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      buy_orders: {
        Row: {
          created_at: string
          id: string
          shipping_address: string
          shipping_city: string
          shipping_country: string
          shipping_phone: string
          shipping_postal_code: string
          shipping_state: string
          status: Database["public"]["Enums"]["order_status"] | null
          total_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          shipping_address: string
          shipping_city: string
          shipping_country: string
          shipping_phone: string
          shipping_postal_code: string
          shipping_state: string
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          shipping_address?: string
          shipping_city?: string
          shipping_country?: string
          shipping_phone?: string
          shipping_postal_code?: string
          shipping_state?: string
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      inventory: {
        Row: {
          buy_stock: number
          created_at: string
          hygiene_status: Database["public"]["Enums"]["hygiene_status"] | null
          id: string
          product_id: string | null
          rent_stock: number
          size: Database["public"]["Enums"]["size_type"]
          updated_at: string
        }
        Insert: {
          buy_stock?: number
          created_at?: string
          hygiene_status?: Database["public"]["Enums"]["hygiene_status"] | null
          id?: string
          product_id?: string | null
          rent_stock?: number
          size: Database["public"]["Enums"]["size_type"]
          updated_at?: string
        }
        Update: {
          buy_stock?: number
          created_at?: string
          hygiene_status?: Database["public"]["Enums"]["hygiene_status"] | null
          id?: string
          product_id?: string | null
          rent_stock?: number
          size?: Database["public"]["Enums"]["size_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          created_at: string
          display_order: number
          id: string
          image_type: string
          image_url: string
          product_id: string | null
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          image_type: string
          image_url: string
          product_id?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          image_type?: string
          image_url?: string
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: Database["public"]["Enums"]["product_category"]
          color: string
          created_at: string
          description: string
          gender: Database["public"]["Enums"]["gender_type"]
          id: string
          is_purchasable: boolean | null
          is_rentable: boolean | null
          material: string | null
          name: string
          purchase_price: number
          rental_deposit: number | null
          rental_max_days: number | null
          rental_price_daily: number | null
          season: string | null
          sku: string
          updated_at: string
        }
        Insert: {
          category: Database["public"]["Enums"]["product_category"]
          color: string
          created_at?: string
          description: string
          gender: Database["public"]["Enums"]["gender_type"]
          id?: string
          is_purchasable?: boolean | null
          is_rentable?: boolean | null
          material?: string | null
          name: string
          purchase_price: number
          rental_deposit?: number | null
          rental_max_days?: number | null
          rental_price_daily?: number | null
          season?: string | null
          sku: string
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["product_category"]
          color?: string
          created_at?: string
          description?: string
          gender?: Database["public"]["Enums"]["gender_type"]
          id?: string
          is_purchasable?: boolean | null
          is_rentable?: boolean | null
          material?: string | null
          name?: string
          purchase_price?: number
          rental_deposit?: number | null
          rental_max_days?: number | null
          rental_price_daily?: number | null
          season?: string | null
          sku?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          city: string | null
          country: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          postal_code: string | null
          role: Database["public"]["Enums"]["user_role"]
          state: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          postal_code?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          state?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          postal_code?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          state?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      rent_order_items: {
        Row: {
          created_at: string
          daily_rate: number
          deposit_amount: number
          duration_days: number
          id: string
          product_id: string | null
          product_name: string
          rent_order_id: string | null
          return_date: string | null
          return_status: Database["public"]["Enums"]["hygiene_status"] | null
          size: Database["public"]["Enums"]["size_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          daily_rate: number
          deposit_amount: number
          duration_days: number
          id?: string
          product_id?: string | null
          product_name: string
          rent_order_id?: string | null
          return_date?: string | null
          return_status?: Database["public"]["Enums"]["hygiene_status"] | null
          size: Database["public"]["Enums"]["size_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          daily_rate?: number
          deposit_amount?: number
          duration_days?: number
          id?: string
          product_id?: string | null
          product_name?: string
          rent_order_id?: string | null
          return_date?: string | null
          return_status?: Database["public"]["Enums"]["hygiene_status"] | null
          size?: Database["public"]["Enums"]["size_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rent_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rent_order_items_rent_order_id_fkey"
            columns: ["rent_order_id"]
            isOneToOne: false
            referencedRelation: "rent_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      rent_orders: {
        Row: {
          created_at: string
          deposit_refunded: boolean | null
          id: string
          refund_amount: number | null
          refund_date: string | null
          rent_end_date: string
          rent_start_date: string
          shipping_address: string
          shipping_city: string
          shipping_country: string
          shipping_phone: string
          shipping_postal_code: string
          shipping_state: string
          status: Database["public"]["Enums"]["rental_status"] | null
          total_deposit: number
          total_rent_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          deposit_refunded?: boolean | null
          id?: string
          refund_amount?: number | null
          refund_date?: string | null
          rent_end_date: string
          rent_start_date: string
          shipping_address: string
          shipping_city: string
          shipping_country: string
          shipping_phone: string
          shipping_postal_code: string
          shipping_state: string
          status?: Database["public"]["Enums"]["rental_status"] | null
          total_deposit: number
          total_rent_amount: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          deposit_refunded?: boolean | null
          id?: string
          refund_amount?: number | null
          refund_date?: string | null
          rent_end_date?: string
          rent_start_date?: string
          shipping_address?: string
          shipping_city?: string
          shipping_country?: string
          shipping_phone?: string
          shipping_postal_code?: string
          shipping_state?: string
          status?: Database["public"]["Enums"]["rental_status"] | null
          total_deposit?: number
          total_rent_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      gender_type: "Men" | "Women" | "Unisex"
      hygiene_status: "Clean" | "Dirty" | "Processing"
      order_status:
        | "Pending"
        | "Packed"
        | "Out for Delivery"
        | "Delivered"
        | "Cancelled"
      product_category:
        | "T-shirts"
        | "Shirts"
        | "Trousers"
        | "Jeans"
        | "Shorts"
        | "Dresses"
        | "Skirts"
        | "Sarees"
        | "Suits"
        | "Sherwanis"
        | "Jackets"
        | "Coats"
        | "Hoodies"
        | "Blazers"
        | "Sweatshirts"
        | "Ethnic"
        | "Formal"
        | "Casual"
        | "Loungewear"
        | "Activewear"
      rental_status:
        | "Booked"
        | "Out for Delivery"
        | "Active"
        | "Returned"
        | "Cancelled"
      size_type: "S" | "M" | "L" | "XL" | "XXL"
      user_role: "customer" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      gender_type: ["Men", "Women", "Unisex"],
      hygiene_status: ["Clean", "Dirty", "Processing"],
      order_status: [
        "Pending",
        "Packed",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      product_category: [
        "T-shirts",
        "Shirts",
        "Trousers",
        "Jeans",
        "Shorts",
        "Dresses",
        "Skirts",
        "Sarees",
        "Suits",
        "Sherwanis",
        "Jackets",
        "Coats",
        "Hoodies",
        "Blazers",
        "Sweatshirts",
        "Ethnic",
        "Formal",
        "Casual",
        "Loungewear",
        "Activewear",
      ],
      rental_status: [
        "Booked",
        "Out for Delivery",
        "Active",
        "Returned",
        "Cancelled",
      ],
      size_type: ["S", "M", "L", "XL", "XXL"],
      user_role: ["customer", "admin"],
    },
  },
} as const
