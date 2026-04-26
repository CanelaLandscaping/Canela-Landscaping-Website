import { useTranslation } from "react-i18next";
import AdminPageCMS from "../components/admin/AdminPageCMS";

const AdminAbout = () => {
  const { t } = useTranslation();
  return <AdminPageCMS pageId="about" pageTitle={t("admin.cms.aboutTitle")} />;
};

export default AdminAbout;
