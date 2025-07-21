import NoteEditor from "../../components/entries/NoteEditor";
import { useSidebar } from "../../store/useStore";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface Draft {
  id: string;
  title: string;
  synopsis: string;
  content: string;
  tags: string[];
}

const NewNote = () => {
  const { sidebarCollapsed } = useSidebar();
  const sidebarWidth = sidebarCollapsed ? 64 : 220;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [draftId, setDraftId] = useState<string | null>(null);

  useEffect(() => {
    const draftEdit = localStorage.getItem("notelyDraftEdit");
    if (draftEdit) {
      const parsedDraft = JSON.parse(draftEdit);
      setDraft(parsedDraft);
      setDraftId(parsedDraft.id);
      localStorage.removeItem("notelyDraftEdit");
    } else {
      setDraftId(null);
    }
  }, []);

  const handleSave = async (data: {
    title: string;
    synopsis: string;
    content: string;
    tags: string[];
  }) => {
    setLoading(true);
    try {
      await axiosInstance.post("/entries", data);
      let drafts: Draft[] = JSON.parse(
        localStorage.getItem("notelyDrafts") || "[]",
      );
      if (draftId) {
        drafts = drafts.filter((d: Draft) => d.id !== draftId);
      } else {
        drafts = drafts.filter(
          (d: Draft) =>
            d.title !== data.title ||
            d.synopsis !== data.synopsis ||
            d.content !== data.content,
        );
      }
      localStorage.setItem("notelyDrafts", JSON.stringify(drafts));
      navigate("/dashboard");
    } catch (e) {
      console.log(e);
      let drafts: Draft[] = JSON.parse(
        localStorage.getItem("notelyDrafts") || "[]",
      );
      if (draftId) {
        drafts = drafts.filter((d: Draft) => d.id !== draftId);
      } else {
        drafts = drafts.filter(
          (d: Draft) =>
            d.title !== data.title ||
            d.synopsis !== data.synopsis ||
            d.content !== data.content,
        );
      }
      localStorage.setItem("notelyDrafts", JSON.stringify(drafts));
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (data: {
    title: string;
    synopsis: string;
    content: string;
    tags: string[];
  }) => {
    // Only save/update draft if there is any content
    if (
      data.title.trim() ||
      data.synopsis.trim() ||
      data.content.trim() ||
      (data.tags && data.tags.length > 0)
    ) {
      let drafts: Draft[] = JSON.parse(
        localStorage.getItem("notelyDrafts") || "[]",
      );
      if (draftId) {
        // Update existing draft
        drafts = drafts.map((d: Draft) =>
          d.id === draftId ? { ...data, id: draftId } : d,
        );
      } else {
        // Add new draft with a new id
        const newId = Date.now().toString();
        drafts.push({ ...data, id: newId });
        setDraftId(newId);
      }
      localStorage.setItem("notelyDrafts", JSON.stringify(drafts));
      toast.success("Note added to drafts!", { position: "top-right" });
    }
    navigate("/drafts");
  };

  return (
    <NoteEditor
      mode="new"
      sidebarWidth={sidebarWidth}
      loading={loading}
      onSave={handleSave}
      onDelete={handleCancel}
      initialTitle={draft?.title || ""}
      initialSynopsis={draft?.synopsis || ""}
      initialContent={draft?.content || ""}
      initialTags={draft?.tags || []}
    />
  );
};

export default NewNote;
