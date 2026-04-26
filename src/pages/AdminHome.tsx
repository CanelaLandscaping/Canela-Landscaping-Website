import { useTranslation } from "react-i18next";
import AdminPageCMS from "../components/admin/AdminPageCMS";

const AdminHome = () => {
  const { t } = useTranslation();
  return <AdminPageCMS pageId="home" pageTitle={t("admin.cms.homeTitle")} />;
};

export default AdminHome;
