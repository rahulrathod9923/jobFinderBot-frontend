export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          details: string | null
          id: number
          timestamp: string
        }
        Insert: {
          action: string
          details?: string | null
          id?: number
          timestamp: string
        }
        Update: {
          action?: string
          details?: string | null
          id?: number
          timestamp?: string
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          active: boolean
          created_at: string
          expires_at: string | null
          id: number
          key_hash: string
          name: string
          prefix: string
        }
        Insert: {
          active?: boolean
          created_at: string
          expires_at?: string | null
          id?: number
          key_hash: string
          name: string
          prefix: string
        }
        Update: {
          active?: boolean
          created_at?: string
          expires_at?: string | null
          id?: number
          key_hash?: string
          name?: string
          prefix?: string
        }
        Relationships: []
      }
      approval_queue: {
        Row: {
          content: string
          created_at: string
          id: number
          job_id: number
          processed_at: string | null
          processed_by: number | null
          status: string
          type: string
        }
        Insert: {
          content: string
          created_at: string
          id?: number
          job_id: number
          processed_at?: string | null
          processed_by?: number | null
          status: string
          type: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: number
          job_id?: number
          processed_at?: string | null
          processed_by?: number | null
          status?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "approval_queue_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approval_queue_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          details: string | null
          id: number
          ip_address: string | null
          timestamp: string
          username: string
        }
        Insert: {
          action: string
          details?: string | null
          id?: number
          ip_address?: string | null
          timestamp: string
          username: string
        }
        Update: {
          action?: string
          details?: string | null
          id?: number
          ip_address?: string | null
          timestamp?: string
          username?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          company_id: number | null
          email: string | null
          id: number
          name: string
          phone: string | null
          social_profile_url: string | null
        }
        Insert: {
          company_id?: number | null
          email?: string | null
          id?: number
          name: string
          phone?: string | null
          social_profile_url?: string | null
        }
        Update: {
          company_id?: number | null
          email?: string | null
          id?: number
          name?: string
          phone?: string | null
          social_profile_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          approved: boolean
          approved_at: string | null
          error_message: string | null
          generated_comment: string
          id: number
          job_id: number
          posted: boolean
          posted_at: string | null
        }
        Insert: {
          approved?: boolean
          approved_at?: string | null
          error_message?: string | null
          generated_comment: string
          id?: number
          job_id: number
          posted?: boolean
          posted_at?: string | null
        }
        Update: {
          approved?: boolean
          approved_at?: string | null
          error_message?: string | null
          generated_comment?: string
          id?: number
          job_id?: number
          posted?: boolean
          posted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: true
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          description: string | null
          id: number
          industry: string | null
          name: string
          website: string | null
        }
        Insert: {
          description?: string | null
          id?: number
          industry?: string | null
          name: string
          website?: string | null
        }
        Update: {
          description?: string | null
          id?: number
          industry?: string | null
          name?: string
          website?: string | null
        }
        Relationships: []
      }
      crawler_logs: {
        Row: {
          end_time: string | null
          error_message: string | null
          id: number
          pages_crawled: number | null
          start_time: string
          status: string
          url: string
        }
        Insert: {
          end_time?: string | null
          error_message?: string | null
          id?: number
          pages_crawled?: number | null
          start_time: string
          status: string
          url: string
        }
        Update: {
          end_time?: string | null
          error_message?: string | null
          id?: number
          pages_crawled?: number | null
          start_time?: string
          status?: string
          url?: string
        }
        Relationships: []
      }
      direct_messages: {
        Row: {
          approved: boolean
          approved_at: string | null
          error_message: string | null
          generated_dm: string
          id: number
          job_id: number
          sent: boolean
          sent_at: string | null
        }
        Insert: {
          approved?: boolean
          approved_at?: string | null
          error_message?: string | null
          generated_dm: string
          id?: number
          job_id: number
          sent?: boolean
          sent_at?: string | null
        }
        Update: {
          approved?: boolean
          approved_at?: string | null
          error_message?: string | null
          generated_dm?: string
          id?: number
          job_id?: number
          sent?: boolean
          sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "direct_messages_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: true
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          budget_confidence: number | null
          category: string | null
          client_confidence: number | null
          client_id: number | null
          client_intent: string | null
          company_id: number | null
          date_found: string
          description: string
          difficulty: number | null
          estimated_value: number | null
          id: number
          is_spam: boolean
          keywords: string | null
          overall_score: number | null
          platform_id: number
          post_url: string
          priority: string | null
          published_at: string | null
          reply_probability: number | null
          status: string
          summary: string | null
          title: string
          urgency_score: number | null
        }
        Insert: {
          budget_confidence?: number | null
          category?: string | null
          client_confidence?: number | null
          client_id?: number | null
          client_intent?: string | null
          company_id?: number | null
          date_found: string
          description: string
          difficulty?: number | null
          estimated_value?: number | null
          id?: number
          is_spam?: boolean
          keywords?: string | null
          overall_score?: number | null
          platform_id: number
          post_url: string
          priority?: string | null
          published_at?: string | null
          reply_probability?: number | null
          status: string
          summary?: string | null
          title: string
          urgency_score?: number | null
        }
        Update: {
          budget_confidence?: number | null
          category?: string | null
          client_confidence?: number | null
          client_id?: number | null
          client_intent?: string | null
          company_id?: number | null
          date_found?: string
          description?: string
          difficulty?: number | null
          estimated_value?: number | null
          id?: number
          is_spam?: boolean
          keywords?: string | null
          overall_score?: number | null
          platform_id?: number
          post_url?: string
          priority?: string | null
          published_at?: string | null
          reply_probability?: number | null
          status?: string
          summary?: string | null
          title?: string
          urgency_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platforms"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_chunks: {
        Row: {
          chunk_index: number
          content: string
          id: number
          summary: string | null
          website_content_id: number
        }
        Insert: {
          chunk_index: number
          content: string
          id?: number
          summary?: string | null
          website_content_id: number
        }
        Update: {
          chunk_index?: number
          content?: string
          id?: number
          summary?: string | null
          website_content_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_chunks_website_content_id_fkey"
            columns: ["website_content_id"]
            isOneToOne: false
            referencedRelation: "website_content"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: number
          is_read: boolean
          message: string
          title: string
        }
        Insert: {
          created_at: string
          id?: number
          is_read?: boolean
          message: string
          title: string
        }
        Update: {
          created_at?: string
          id?: number
          is_read?: boolean
          message?: string
          title?: string
        }
        Relationships: []
      }
      permissions: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      platforms: {
        Row: {
          base_url: string | null
          display_name: string
          enabled: boolean
          id: number
          name: string
        }
        Insert: {
          base_url?: string | null
          display_name: string
          enabled?: boolean
          id?: number
          name: string
        }
        Update: {
          base_url?: string | null
          display_name?: string
          enabled?: boolean
          id?: number
          name?: string
        }
        Relationships: []
      }
      refresh_tokens: {
        Row: {
          expiry_date: string
          id: number
          token: string
          user_id: number
        }
        Insert: {
          expiry_date: string
          id?: number
          token: string
          user_id: number
        }
        Update: {
          expiry_date?: string
          id?: number
          token?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "refresh_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          permission_id: number
          role_id: number
        }
        Insert: {
          permission_id: number
          role_id: number
        }
        Update: {
          permission_id?: number
          role_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      scheduler_logs: {
        Row: {
          details: string | null
          end_time: string | null
          error_message: string | null
          id: number
          job_name: string
          start_time: string
          status: string
        }
        Insert: {
          details?: string | null
          end_time?: string | null
          error_message?: string | null
          id?: number
          job_name: string
          start_time: string
          status: string
        }
        Update: {
          details?: string | null
          end_time?: string | null
          error_message?: string | null
          id?: number
          job_name?: string
          start_time?: string
          status?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          config_key: string
          config_value: string
          description: string | null
        }
        Insert: {
          config_key: string
          config_value: string
          description?: string | null
        }
        Update: {
          config_key?: string
          config_value?: string
          description?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          role_id: number
          user_id: number
        }
        Insert: {
          role_id: number
          user_id: number
        }
        Update: {
          role_id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          enabled: boolean
          id: number
          password: string
          updated_at: string | null
          username: string
        }
        Insert: {
          created_at: string
          email: string
          enabled?: boolean
          id?: number
          password: string
          updated_at?: string | null
          username: string
        }
        Update: {
          created_at?: string
          email?: string
          enabled?: boolean
          id?: number
          password?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      website_content: {
        Row: {
          clean_text: string | null
          crawled_at: string
          id: number
          title: string | null
          url: string
        }
        Insert: {
          clean_text?: string | null
          crawled_at: string
          id?: number
          title?: string | null
          url: string
        }
        Update: {
          clean_text?: string | null
          crawled_at?: string
          id?: number
          title?: string | null
          url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_old_data: { Args: never; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
