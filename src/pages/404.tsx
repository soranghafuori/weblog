import MainLayout from "@/layouts/MainLayout";
import Link from "next/link";


function E404() {
    return ( 
        <MainLayout>
            <div style={{height:'80vh'}}>
                <h1>Not Found </h1>
                <Link href={'/'}>return to <span style={{color:'blue'}}>Home page</span> </Link>
            </div>
        </MainLayout>
    
    );
}

export default E404;