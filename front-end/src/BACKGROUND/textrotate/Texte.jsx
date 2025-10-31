'use client';


import './Texte.css';
import LoginModal from '../../Pages/modal/Login';

const words = ['Security', 'Improvement', 'Numérique'];

export default function HeroText() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 6000); // changement de mot toutes les 2s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-container">
      <h1 className="hero-titl">
        Bienvenue sur <span className="highlight">CyberManager</span>, votre plateforme pour la gestion numérique sécurisée.
      </h1>
      <div className="log"><button className='login' onClick={()=>setLoginOpen(true)}>Login</button>
       <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} onSubmit={(data) => console.log("login", data)} />
      <div className="rotating-container">
        
        <span className="rotating-word">{words[currentWordIndex]}</span>
        </div>
      </div>
    </div>
  );
}
