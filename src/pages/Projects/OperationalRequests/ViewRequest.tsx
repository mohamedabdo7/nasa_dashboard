import React, { useEffect } from "react";
import { getOneOperationalRequest } from "../../../services";
// import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

const ViewRequest: React.FC = () => {
  // const { t } = useTranslation();
  // const navigate = useNavigate();
  const { id } = useParams();

  const getEmployeeHandler = async () => {
    try {
      const { data } = await getOneOperationalRequest(id!);

      console.log(data);
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    getEmployeeHandler();
  }, [id]);

  return <div>ViewRequest</div>;
};

export default ViewRequest;
