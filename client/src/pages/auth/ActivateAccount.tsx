import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";

const ActivateAccount = () => {
  const { id, token } = useParams<{ id: string; token: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const activate = async () => {
      if (!id || !token) {
        navigate("/login", { replace: true });
        return;
      }
      try {
        await axiosInstance.get(`/auth/activate/${id}/${token}`);
        navigate("/login?activated=1", { replace: true });
      } catch {
        navigate("/login", { replace: true });
      }
    };
    activate();
  }, [id, token, navigate]);

  return null;
};

export default ActivateAccount;
