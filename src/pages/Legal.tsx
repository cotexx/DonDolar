import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Legal() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-900 via-blue-700 to-blue-800'}`}>
      <Navbar darkMode={darkMode} onDarkModeToggle={() => setDarkMode(!darkMode)} />
      <div className="container mx-auto px-4 py-12">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-white hover:text-yellow-400 transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span>Volver al inicio</span>
        </Link>
        
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-blue-900 dark:text-white mb-8">Información Legal</h1>
          
          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <p>
              Dolarbluehoy.ar es un sitio meramente informativo, y no brinda consejo, recomendación, asesoramiento o invitación de ningún tipo, ni de ninguna clase o naturaleza, para realizar actos y/u operaciones de cualquier tipo, clase o naturaleza.
            </p>
            <p>
              Las fuentes de información aquí citadas son de público acceso. Los cuadros mostrados en este sitio son elaborados sobre la base de los datos de público acceso que en cada caso se indica, y constituyen propiedad intelectual amparada por la Ley N°11.723.
            </p>
            <p>
              Los titulares de este sitio deslindan toda responsabilidad respecto de la posible falta de precisión y/o veracidad y/o exactitud y/o integridad y/o vigencia de los datos y/o de las fuentes de información de público acceso tenidos en consideración para la elaboración del contenido de este sitio.
            </p>
            <p>
              Los titulares de este sitio no garantizan la precisión y/o veracidad y/o exactitud y/o integridad y/o vigencia de los datos mostrados en este sitio.
            </p>
            <p>
              Los titulares de este sitio deslindan toda responsabilidad respecto del uso que puedan llegar a dar a la información y/o a los datos incluídos en el contenido de este sitio quienes accedan a este último.
            </p>
            <p>
              Los titulares de este sitio no se responabilizan por los eventuales daños patrimoniales y/o perjuicios que pudieren resultar de decisiones adoptadas sobre la base de los datos mostrados en este sitio por quienes accedan a este último.
            </p>
            <p>
              Los titulares de este sitio no mantienen ni poseen ningún tipo de acuerdo, asociación, alianza o vínculo con los anunciantes que publicitan sus productos y/o servicios en este sitio más que la locación de espacios publicitarios.
            </p>
            <p>
              Los titulares de este sitio no se responsabilizan respecto de la precisión y/o veracidad y/o exactitud y/o integridad y/o vigencia de los contenidos de las piezas publicitarias o banners, por lo que tales contenidos son de exclusiva responsabilidad de los respectivos anunciantes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}