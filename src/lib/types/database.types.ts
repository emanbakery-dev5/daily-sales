export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string;
          correlation_id: string;
          created_at: string;
          description: string | null;
          event_type: string;
          id: string;
          ip_address: unknown;
          module: string;
          new_values: Json | null;
          old_values: Json | null;
          user_agent: string | null;
          user_id: string | null;
        };
        Insert: {
          action: string;
          correlation_id?: string;
          created_at?: string;
          description?: string | null;
          event_type: string;
          id?: string;
          ip_address?: unknown;
          module?: string;
          new_values?: Json | null;
          old_values?: Json | null;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Update: {
          action?: string;
          correlation_id?: string;
          created_at?: string;
          description?: string | null;
          event_type?: string;
          id?: string;
          ip_address?: unknown;
          module?: string;
          new_values?: Json | null;
          old_values?: Json | null;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      login_history: {
        Row: {
          correlation_id: string;
          created_at: string;
          device_info: Json | null;
          email: string;
          event_type: Database["public"]["Enums"]["auth_event_type"];
          failure_reason: string | null;
          id: string;
          ip_address: unknown;
          success: boolean;
          user_agent: string | null;
          user_id: string | null;
        };
        Insert: {
          correlation_id?: string;
          created_at?: string;
          device_info?: Json | null;
          email: string;
          event_type: Database["public"]["Enums"]["auth_event_type"];
          failure_reason?: string | null;
          id?: string;
          ip_address?: unknown;
          success: boolean;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Update: {
          correlation_id?: string;
          created_at?: string;
          device_info?: Json | null;
          email?: string;
          event_type?: Database["public"]["Enums"]["auth_event_type"];
          failure_reason?: string | null;
          id?: string;
          ip_address?: unknown;
          success?: boolean;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      password_reset_tokens: {
        Row: {
          created_at: string;
          expires_at: string;
          id: string;
          ip_address: unknown;
          token_hash: string;
          used_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          expires_at: string;
          id?: string;
          ip_address?: unknown;
          token_hash: string;
          used_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          expires_at?: string;
          id?: string;
          ip_address?: unknown;
          token_hash?: string;
          used_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      user_profiles: {
        Row: {
          created_at: string;
          created_by: string | null;
          email: string;
          failed_login_attempts: number;
          full_name: string;
          id: string;
          last_login_at: string | null;
          last_login_ip: unknown;
          locked_until: string | null;
          must_change_password: boolean;
          password_changed_at: string | null;
          role: Database["public"]["Enums"]["user_role"];
          status: Database["public"]["Enums"]["user_status"];
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          email: string;
          failed_login_attempts?: number;
          full_name: string;
          id: string;
          last_login_at?: string | null;
          last_login_ip?: unknown;
          locked_until?: string | null;
          must_change_password?: boolean;
          password_changed_at?: string | null;
          role?: Database["public"]["Enums"]["user_role"];
          status?: Database["public"]["Enums"]["user_status"];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          email?: string;
          failed_login_attempts?: number;
          full_name?: string;
          id?: string;
          last_login_at?: string | null;
          last_login_ip?: unknown;
          locked_until?: string | null;
          must_change_password?: boolean;
          password_changed_at?: string | null;
          role?: Database["public"]["Enums"]["user_role"];
          status?: Database["public"]["Enums"]["user_status"];
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_active_user: { Args: never; Returns: boolean };
    };
    Enums: {
      auth_event_type:
        | "login_success"
        | "login_failed"
        | "logout"
        | "password_reset_requested"
        | "password_reset_completed"
        | "session_expired"
        | "session_refreshed"
        | "unauthorized_access"
        | "account_locked"
        | "account_unlocked"
        | "permission_load_failure";
      user_role:
        | "system_administrator"
        | "operations_manager"
        | "finance_officer"
        | "sales_coordinator"
        | "read_only_user";
      user_status: "active" | "inactive" | "locked" | "pending_password_reset";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      auth_event_type: [
        "login_success",
        "login_failed",
        "logout",
        "password_reset_requested",
        "password_reset_completed",
        "session_expired",
        "session_refreshed",
        "unauthorized_access",
        "account_locked",
        "account_unlocked",
        "permission_load_failure",
      ],
      user_role: [
        "system_administrator",
        "operations_manager",
        "finance_officer",
        "sales_coordinator",
        "read_only_user",
      ],
      user_status: ["active", "inactive", "locked", "pending_password_reset"],
    },
  },
} as const;

export type UserProfileRow =
  Database["public"]["Tables"]["user_profiles"]["Row"];
