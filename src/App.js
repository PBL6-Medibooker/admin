import Login from "./pages/Login";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Route, Routes} from "react-router-dom";
import Navbar from "./components/Navbar";
import {useContext} from "react";
import {AdminContext} from "./context/AdminContext";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Admin/Dashboard";
import SpecialityList from "./pages/Speciality/SpecialityList";
import AddSpeciality from "./pages/Speciality/AddSpeciality";
import UpdateSpeciality from "./pages/Speciality/UpdateSpeciality";
import AccountList from "./pages/Account/AccountList";
import DoctorAccountList from "./pages/Account/DoctorAccountList";
import AddNewCustomerAcc from "./pages/Account/AddNewCustomerAcc";
import AccountDetails from "./pages/Account/AccountDetails";
import AddDoctorAccount from "./pages/Account/AddDoctorAccount";
import RestoreAccount from "./pages/Account/RestoreAccount";
import UpdateDocInfoAcc from "./pages/Account/UpdateDocInfoAcc";
import RegionList from "./pages/Region/RegionList";
import RestoreRegion from "./pages/Region/RestoreRegion";
import RestoreCusAccount from "./pages/Account/RestoreCusAccount";
import RestoreSpeciality from "./pages/Speciality/RestoreSpeciality";
import {DoctorContext} from "./context/DoctorContext";
import AppointmentList from "./pages/Appointment/AppointmentList";
import AddAppointment from "./pages/Appointment/AddAppointment";
import SpecialityDashBoard from "./pages/Speciality/SpecialityDashBoard";
import AppointmentDashboard from "./pages/Appointment/AppointmentDashboard";
import AccountDashboard from "./pages/Account/AccountDashboard";
import VerifyDoctorList from "./pages/Account/VerifyDoctorList";
import UpdateAppointmentInfo from "./pages/Appointment/UpdateAppointmentInfo";
import RegionDashboard from "./pages/Region/RegionDashboard";
import ArticleDashboard from "./pages/Article/ArticleDashboard";
import ArticleList from "./pages/Article/ArticleList";
// import AdminProfile from "./pages/AdminProfile";
import AdminProfile from "./pages/Admin/AdminProfile";
import CreateArticle from "./pages/Article/CreateArticle";
import UpdateArticle from "./pages/Article/UpdateArticle";
import RestoreArticle from "./pages/Article/RestoreArticle";
import AddInsuranceByAppointmentId from "./pages/Appointment/AddInsuranceByAppointmentId";
import ForumDashboard from "./pages/Forum/ForumDashboard";
import PostListByForum from "./pages/Forum/PostListByForum";
import PostSpeciality from "./pages/Forum/PostSpeciality";
import PostDetails from "./pages/Forum/PostDetails";
import DoctorProfile from "./pages/Doctor/DoctorProfile";
import DoctorAppointments from "./pages/Doctor/DoctorAppointments";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import UpdateAppointment from "./pages/Doctor/UpdateAppointment";
import Test from "./pages/Test";
import './config-translation'
import Loading from "./pages/Loading";
import UserAppointments from "./pages/Account/UserAppointments";
import DoctorArticleList from "./pages/Doctor/article/DoctorArticleList";
import DoctorCreateArticle from "./pages/Doctor/article/DoctorCreateArticle";


function App() {
    const {aToken} = useContext(AdminContext)
    const {dToken} = useContext(DoctorContext);

    return aToken || dToken ? (
        <div className='bg-[#F8F9FD]'>
            <ToastContainer/>
            <Navbar/>
            <div className='flex items-start'>
                <Sidebar/>
                <Routes>
                    <Route path='/' element={<></>} />
                    {/*<Route path='/' element={<Test />} />*/}
                    {/*<Route path='/' element={<Loading />} />*/}
                    <Route path='/admin-dashboard' element={<Dashboard/>}/>
                    {/*<Route path='/admin-profile' element={<AdminProfile/>}/>*/}
                    <Route path='/admin-profile' element={<AdminProfile/>}/>

                    <Route path='/speciality-dashboard' element={<SpecialityDashBoard/>} />
                    <Route path='/speciality' element={<SpecialityList/>} />
                    <Route path='/add-speciality' element={<AddSpeciality/>} />
                    <Route path='/get-speciality/:id' element={<UpdateSpeciality/>} />
                    <Route path='/restore-speciality' element={<RestoreSpeciality/>} />


                    <Route path='/account-dashboard' element={<AccountDashboard/>} />
                    <Route path='/account' element={<AccountList/>} />
                    <Route path='/doc-account' element={<DoctorAccountList/>} />
                    <Route path='/verified-doc-account' element={<VerifyDoctorList/>} />
                    <Route path='/add-customer-account' element={<AddNewCustomerAcc/>} />
                    <Route path='/restore-cus-account' element={<RestoreCusAccount/>} />
                    <Route path="/update-cus-account/:email" element={<AccountDetails />} />
                    <Route path='/add-doc-account' element={<AddDoctorAccount/>} />
                    <Route path='/restore-account' element={<RestoreAccount/>} />
                    <Route path='/update-doc-account/:id' element={<UpdateDocInfoAcc/>} />

                    <Route path='/region' element={<RegionList/>} />
                    <Route path='/region-dashboard' element={<RegionDashboard/>} />
                    <Route path='/restore-region' element={<RestoreRegion/>} />

                    <Route path='/appointment' element={<AppointmentDashboard/>} />
                    <Route path='/all-appointment' element={<AppointmentList/>} />
                    <Route path='/booking-appointment' element={<AddAppointment/>} />
                    <Route path='/update-appointment-info/:id' element={<UpdateAppointmentInfo/>} />
                    <Route path='/add-insurance/:id' element={<AddInsuranceByAppointmentId/>} />
                    <Route path='/user-appointments/:id' element={<UserAppointments/>} />


                    <Route path='/article-dashboard' element={<ArticleDashboard/>} />
                    <Route path='/article' element={<ArticleList/>} />
                    <Route path='/create-article' element={<CreateArticle/>} />
                    <Route path='/update-article/:id' element={<UpdateArticle/>} />
                    <Route path='/restore-article' element={<RestoreArticle/>} />


                    <Route path='/forum-dashboard' element={<ForumDashboard/>} />
                    <Route path='/spec-forum' element={<PostSpeciality/>} />
                    <Route path='/post-list-by-spec' element={<PostListByForum/>} />
                    <Route path='/update-post/:id' element={<PostDetails/>} />


                    <Route path='/doctor-profile' element={<DoctorProfile/>} />
                    <Route path='/doctor-dashboard' element={<DoctorDashboard/>} />
                    <Route path='/doctor-article' element={<DoctorArticleList/>} />
                    <Route path='/doctor-create-article' element={<DoctorCreateArticle/>} />
                    <Route path='/doctor-appointments' element={<DoctorAppointments/>} />
                    <Route path='/update-appointment-of-doctor/:id' element={<UpdateAppointment/>} />


                </Routes>
            </div>

        </div>
    ): (
        <>
            <Login/>
            <ToastContainer/>
        </>
    );
}

export default App;
