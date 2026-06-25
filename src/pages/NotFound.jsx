import { Link } from 'react-router-dom' 

export default function NotFound() { 
    return ( 
        <div className="flex flex-col items-center justify-cent er h-screen text-center"> 
            <h1 className="text-4xl font-bold text-gray-800">404 
                </h1> <p className="text-gray-500 mt-2">Página não encontra da.</p> 
                <Link to="/dashboard" className="text-blue-600 mt-4 u nderline"> 
                Voltar ao Dashboard 
            </Link> 
        </div> 
    ) 
}