export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: string;
          cover_image_url: string | null;
          sort_order: number;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string;
          category: string;
          cover_image_url?: string | null;
          sort_order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          category?: string;
          cover_image_url?: string | null;
          sort_order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      project_media: {
        Row: {
          id: string;
          project_id: string;
          type: "image" | "video" | "video_embed";
          url: string;
          alt: string | null;
          poster_url: string | null;
          sort_order: number;
        };
        Insert: {
          id?: string;
          project_id: string;
          type: "image" | "video" | "video_embed";
          url: string;
          alt?: string | null;
          poster_url?: string | null;
          sort_order?: number;
        };
        Update: {
          id?: string;
          project_id?: string;
          type?: "image" | "video" | "video_embed";
          url?: string;
          alt?: string | null;
          poster_url?: string | null;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "project_media_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      site_content: {
        Row: {
          key: string;
          value: Json;
          updated_at: string;
        };
        Insert: {
          key: string;
          value?: Json;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          id: number;
          whatsapp: string | null;
          email: string | null;
          instagram: string | null;
          youtube: string | null;
          phone: string | null;
          primary_color: string | null;
          contact_headline: string | null;
          contact_intro: string | null;
          updated_at: string;
        };
        Insert: {
          id?: number;
          whatsapp?: string | null;
          email?: string | null;
          instagram?: string | null;
          youtube?: string | null;
          phone?: string | null;
          primary_color?: string | null;
          contact_headline?: string | null;
          contact_intro?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: number;
          whatsapp?: string | null;
          email?: string | null;
          instagram?: string | null;
          youtube?: string | null;
          phone?: string | null;
          primary_color?: string | null;
          contact_headline?: string | null;
          contact_intro?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
