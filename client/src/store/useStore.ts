import { create, type StateCreator } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  avatar?: string;
  createdAt: string;
}

export interface PublicNote {
  id: number;
  title: string;
  synopsis: string;
  author: {
    firstName: string;
    avatar?: string;
  };
}

interface UserStore {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User) => void;
  logoutUser: () => void;
  setLoading: (loading: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  publicNotes: PublicNote[];
  addPublicNote: (note: Omit<PublicNote, "id">) => void;
}

const userStore: StateCreator<UserStore> = (set, get) => ({
  user: null,
  isLoading: true,
  setUser: (user: User) => set({ user, isLoading: false }),
  logoutUser: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("zustand-persist-Notely");
    set({ user: null, isLoading: false });
  },
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed: boolean) =>
    set({ sidebarCollapsed: collapsed }),
  publicNotes: [],
  addPublicNote: (note) =>
    set({ publicNotes: [...get().publicNotes, { ...note, id: Date.now() }] }),
});

const useUser = create(
  persist(userStore, {
    name: "Notely",
    partialize: (state) => ({ user: state.user }),
  }),
);

export const useAuth = () => {
  const user = useUser((state) => state.user);
  const isLoading = useUser((state) => state.isLoading);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    setUser: useUser((state) => state.setUser),
    logoutUser: useUser((state) => state.logoutUser),
    setLoading: useUser((state) => state.setLoading),
  };
};

export const useSidebar = () => {
  const sidebarCollapsed = useUser((state) => state.sidebarCollapsed);
  const setSidebarCollapsed = useUser((state) => state.setSidebarCollapsed);
  return { sidebarCollapsed, setSidebarCollapsed };
};

export const usePublicNotes = () => {
  const publicNotes = useUser((state) => state.publicNotes);
  const addPublicNote = useUser((state) => state.addPublicNote);
  return { publicNotes, addPublicNote };
};

interface BookmarksStore {
  bookmarks: Record<string, string[]>; // userId
  addBookmark: (userId: string, noteId: string) => void;
  removeBookmark: (userId: string, noteId: string) => void;
  isBookmarked: (userId: string, noteId: string) => boolean;
}

const bookmarksStore: StateCreator<BookmarksStore> = (set, get) => ({
  bookmarks: {},
  addBookmark: (userId, noteId) => {
    set((state) => ({
      bookmarks: {
        ...state.bookmarks,
        [userId]: [...(state.bookmarks[userId] || []), noteId],
      },
    }));
  },
  removeBookmark: (userId, noteId) => {
    set((state) => ({
      bookmarks: {
        ...state.bookmarks,
        [userId]: (state.bookmarks[userId] || []).filter((id) => id !== noteId),
      },
    }));
  },
  isBookmarked: (userId, noteId) => {
    return (get().bookmarks[userId] || []).includes(noteId);
  },
});

export const useBookmarks = create(
  persist(bookmarksStore, {
    name: "NotelyBookmarks",
  }),
);

export default useUser;
