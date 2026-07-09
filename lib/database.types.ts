export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type MemoryType =
  | "note"
  | "idea"
  | "task"
  | "reminder"
  | "event"
  | "link"
  | "image"
  | "video"
  | "audio"
  | "file"
  | "job"
  | "person"
  | "research"
  | "achievement";

export type MemoryStatus = "pending" | "processing" | "processed" | "failed";
export type MemoryPriority = "low" | "medium" | "high";
export type ReminderStatus =
  | "pending"
  | "sent"
  | "completed"
  | "failed"
  | "cancelled";

export type Database = {
  public: {
    Tables: {
      memories: {
        Row: {
          id: string;
          user_id: string;
          source: string;
          source_message_id: string | null;
          type: MemoryType;
          status: MemoryStatus;
          raw_text: string | null;
          title: string | null;
          summary: string | null;
          extracted_text: string | null;
          transcript: string | null;
          url: string | null;
          tags: string[];
          search_keywords: string[];
          priority: MemoryPriority;
          reminder_at: string | null;
          event_start: string | null;
          event_end: string | null;
          action_items: Json;
          people: string[];
          file_url: string | null;
          file_type: string | null;
          file_name: string | null;
          file_size_bytes: number | null;
          embedding: string | null;
          ai_metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          source?: string;
          source_message_id?: string | null;
          type: MemoryType;
          status?: MemoryStatus;
          raw_text?: string | null;
          title?: string | null;
          summary?: string | null;
          extracted_text?: string | null;
          transcript?: string | null;
          url?: string | null;
          tags?: string[];
          search_keywords?: string[];
          priority?: MemoryPriority;
          reminder_at?: string | null;
          event_start?: string | null;
          event_end?: string | null;
          action_items?: Json;
          people?: string[];
          file_url?: string | null;
          file_type?: string | null;
          file_name?: string | null;
          file_size_bytes?: number | null;
          embedding?: string | null;
          ai_metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          source?: string;
          source_message_id?: string | null;
          type?: MemoryType;
          status?: MemoryStatus;
          raw_text?: string | null;
          title?: string | null;
          summary?: string | null;
          extracted_text?: string | null;
          transcript?: string | null;
          url?: string | null;
          tags?: string[];
          search_keywords?: string[];
          priority?: MemoryPriority;
          reminder_at?: string | null;
          event_start?: string | null;
          event_end?: string | null;
          action_items?: Json;
          people?: string[];
          file_url?: string | null;
          file_type?: string | null;
          file_name?: string | null;
          file_size_bytes?: number | null;
          embedding?: string | null;
          ai_metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      reminders: {
        Row: {
          id: string;
          user_id: string;
          memory_id: string | null;
          title: string;
          description: string | null;
          remind_at: string;
          status: ReminderStatus;
          sent_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          memory_id?: string | null;
          title: string;
          description?: string | null;
          remind_at: string;
          status?: ReminderStatus;
          sent_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          memory_id?: string | null;
          title?: string;
          description?: string | null;
          remind_at?: string;
          status?: ReminderStatus;
          sent_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reminders_memory_id_fkey";
            columns: ["memory_id"];
            isOneToOne: false;
            referencedRelation: "memories";
            referencedColumns: ["id"];
          },
        ];
      };
      memory_files: {
        Row: {
          id: string;
          memory_id: string | null;
          user_id: string;
          storage_path: string;
          public_url: string | null;
          file_type: string | null;
          file_name: string | null;
          file_size_bytes: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          memory_id?: string | null;
          user_id: string;
          storage_path: string;
          public_url?: string | null;
          file_type?: string | null;
          file_name?: string | null;
          file_size_bytes?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          memory_id?: string | null;
          user_id?: string;
          storage_path?: string;
          public_url?: string | null;
          file_type?: string | null;
          file_name?: string | null;
          file_size_bytes?: number | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "memory_files_memory_id_fkey";
            columns: ["memory_id"];
            isOneToOne: false;
            referencedRelation: "memories";
            referencedColumns: ["id"];
          },
        ];
      };
      memory_chunks: {
        Row: {
          id: string;
          memory_id: string | null;
          user_id: string;
          chunk_text: string;
          embedding: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          memory_id?: string | null;
          user_id: string;
          chunk_text: string;
          embedding?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          memory_id?: string | null;
          user_id?: string;
          chunk_text?: string;
          embedding?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "memory_chunks_memory_id_fkey";
            columns: ["memory_id"];
            isOneToOne: false;
            referencedRelation: "memories";
            referencedColumns: ["id"];
          },
        ];
      };
      telegram_users: {
        Row: {
          id: string;
          user_id: string;
          telegram_user_id: string;
          telegram_username: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          telegram_user_id: string;
          telegram_username?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          telegram_user_id?: string;
          telegram_username?: string | null;
          created_at?: string;
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
