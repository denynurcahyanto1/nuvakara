
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "public": {
          Tables: {
            "admin_activity_logs": {
                  Row: {
                    "action": string,"admin_email": string | null,"admin_id": string | null,"created_at": string,"entity_id": string | null,"entity_type": string | null,"id": number,"ip": string | null,"metadata": NonNullable<Json>
                  }
                  ComputedFields: never
                  Insert: {
                    "action": string,"admin_email"?: string | null,"admin_id"?: string | null,"created_at"?: string,"entity_id"?: string | null,"entity_type"?: string | null,"id"?: never,"ip"?: string | null,"metadata"?: NonNullable<Json>
                  }
                  Update: {
                    "action"?: string,"admin_email"?: string | null,"admin_id"?: string | null,"created_at"?: string,"entity_id"?: string | null,"entity_type"?: string | null,"id"?: never,"ip"?: string | null,"metadata"?: NonNullable<Json>
                  }
                  Relationships: [
                    {
      foreignKeyName: "admin_activity_logs_admin_id_fkey"
      columns: ["admin_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"event_visits": {
                  Row: {
                    "created_at": string | null,"event_id": number | null,"id": number,"user_id": number | null
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string | null,"event_id"?: number | null,"id"?: number,"user_id"?: number | null
                  }
                  Update: {
                    "created_at"?: string | null,"event_id"?: number | null,"id"?: number,"user_id"?: number | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "event_visits_event_id_fkey"
      columns: ["event_id"]
isOneToOne: false
      referencedRelation: "events"
      referencedColumns: ["id"]
    }
                  ]
                },"events": {
                  Row: {
                    "created_at": string | null,"description": string | null,"id": number,"is_active": boolean | null,"is_published": boolean | null,"name": string,"owner_id": string,"slug": string,"updated_at": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string | null,"description"?: string | null,"id"?: number,"is_active"?: boolean | null,"is_published"?: boolean | null,"name": string,"owner_id": string,"slug": string,"updated_at"?: string | null
                  }
                  Update: {
                    "created_at"?: string | null,"description"?: string | null,"id"?: number,"is_active"?: boolean | null,"is_published"?: boolean | null,"name"?: string,"owner_id"?: string,"slug"?: string,"updated_at"?: string | null
                  }
                  Relationships: [
                    
                  ]
                },"guestbook_messages": {
                  Row: {
                    "content": string,"created_at": string | null,"event_id": number,"id": number,"name": string
                  }
                  ComputedFields: never
                  Insert: {
                    "content": string,"created_at"?: string | null,"event_id": number,"id"?: number,"name": string
                  }
                  Update: {
                    "content"?: string,"created_at"?: string | null,"event_id"?: number,"id"?: number,"name"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "guestbook_messages_event_id_fkey"
      columns: ["event_id"]
isOneToOne: false
      referencedRelation: "events"
      referencedColumns: ["id"]
    }
                  ]
                },"pricing_plans": {
                  Row: {
                    "allow_premium_templates": boolean,"billing_period": string,"created_at": string,"currency": string,"description": string | null,"duration_days": number | null,"features": (string)[],"id": string,"is_active": boolean,"is_premium": boolean,"max_invitations": number,"name": string,"price": number,"slug": string,"sort_order": number,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "allow_premium_templates"?: boolean,"billing_period"?: string,"created_at"?: string,"currency"?: string,"description"?: string | null,"duration_days"?: number | null,"features"?: (string)[],"id"?: string,"is_active"?: boolean,"is_premium"?: boolean,"max_invitations"?: number,"name": string,"price"?: number,"slug": string,"sort_order"?: number,"updated_at"?: string
                  }
                  Update: {
                    "allow_premium_templates"?: boolean,"billing_period"?: string,"created_at"?: string,"currency"?: string,"description"?: string | null,"duration_days"?: number | null,"features"?: (string)[],"id"?: string,"is_active"?: boolean,"is_premium"?: boolean,"max_invitations"?: number,"name"?: string,"price"?: number,"slug"?: string,"sort_order"?: number,"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"profiles": {
                  Row: {
                    "avatar_url": string | null,"created_at": string,"email": string | null,"full_name": string | null,"id": string,"phone": string | null,"role": string,"status": string,"timezone": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "avatar_url"?: string | null,"created_at"?: string,"email"?: string | null,"full_name"?: string | null,"id": string,"phone"?: string | null,"role"?: string,"status"?: string,"timezone"?: string,"updated_at"?: string
                  }
                  Update: {
                    "avatar_url"?: string | null,"created_at"?: string,"email"?: string | null,"full_name"?: string | null,"id"?: string,"phone"?: string | null,"role"?: string,"status"?: string,"timezone"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"rsvps": {
                  Row: {
                    "attendance": boolean,"created_at": string | null,"event_id": number,"id": number,"message": string | null,"name": string,"updated_at": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "attendance"?: boolean,"created_at"?: string | null,"event_id": number,"id"?: number,"message"?: string | null,"name": string,"updated_at"?: string | null
                  }
                  Update: {
                    "attendance"?: boolean,"created_at"?: string | null,"event_id"?: number,"id"?: number,"message"?: string | null,"name"?: string,"updated_at"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "rsvps_event_id_fkey"
      columns: ["event_id"]
isOneToOne: false
      referencedRelation: "events"
      referencedColumns: ["id"]
    }
                  ]
                },"schema_migrations": {
                  Row: {
                    "applied_at": string,"name": string
                  }
                  ComputedFields: never
                  Insert: {
                    "applied_at"?: string,"name": string
                  }
                  Update: {
                    "applied_at"?: string,"name"?: string
                  }
                  Relationships: [
                    
                  ]
                },"templates": {
                  Row: {
                    "description": string | null,"id": number,"name": string
                  }
                  ComputedFields: never
                  Insert: {
                    "description"?: string | null,"id"?: number,"name": string
                  }
                  Update: {
                    "description"?: string | null,"id"?: number,"name"?: string
                  }
                  Relationships: [
                    
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "is_admin":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "public": {
          Enums: {
            
          }
        }
} as const
