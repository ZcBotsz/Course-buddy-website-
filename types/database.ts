export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          thumbnail_url: string | null;
          sort_order: number;
          count: number;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          thumbnail_url?: string | null;
          sort_order?: number;
          count?: number;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          thumbnail_url?: string | null;
          sort_order?: number;
          count?: number;
        };
      };
      courses: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          thumbnail_url: string | null;
          price: string | null;
          sales_page_url: string | null;
          category_id: string;
          parent_course_id: string | null;
          sort_order: number;
          content: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          thumbnail_url?: string | null;
          price?: string | null;
          sales_page_url?: string | null;
          category_id: string;
          parent_course_id?: string | null;
          sort_order?: number;
          content?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          thumbnail_url?: string | null;
          price?: string | null;
          sales_page_url?: string | null;
          category_id?: string;
          parent_course_id?: string | null;
          sort_order?: number;
          content?: string | null;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
