import { useState, useRef, useEffect } from 'react';

// ============================================
// RESPONSIVE HOOK
// ============================================

function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  
  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return {
    ...size,
    isMobile: size.width < 640,
    isTablet: size.width >= 640 && size.width < 1024,
    isDesktop: size.width >= 1024,
  };
}

// ============================================
// DATA
// ============================================

const COLORS = {
  verb: { bg: "#d4e4ed", text: "#2d5a7b" },
  noun: { bg: "#f0e6d3", text: "#8b6914" },
  other: { bg: "#e8dff0", text: "#6b4d7c" },
};

const VOCAB_P1 = [
  { swedish: "nalkas", meaning: "approaches", type: "verb", phonetic: "nal-kas" },
  { swedish: "krönas", meaning: "to be crowned", type: "verb", phonetic: "krur-nas" },
  { swedish: "ej", meaning: "not", type: "other", phonetic: "ay" },
  { swedish: "kyrkan", meaning: "the church", type: "noun", phonetic: "shir-kan" },
];

const VOCAB_P2 = [
  { swedish: "härskar", meaning: "reigns / rules", type: "verb", phonetic: "hair-skar" },
  { swedish: "arv", meaning: "heritage", type: "noun", phonetic: "arv" },
  { swedish: "skräck", meaning: "terror", type: "noun", phonetic: "skrek" },
  { swedish: "gång", meaning: "time / occasion", type: "noun", phonetic: "gong" },
];

const ALL_VOCAB = [...VOCAB_P1, ...VOCAB_P2];

const LYRICS_P1 = [
  { swedish: "Ny tid nalkas, denna tid går mot sitt slut", english: "A new time approaches, this era nears its end", words: ["nalkas"], englishHL: ["approaches"] },
  { swedish: "Hela Stockholm se mig krönas, kanoner skjut salut", english: "All of Stockholm see me crowned, cannons fire salute", words: ["krönas"], englishHL: ["crowned"] },
  { swedish: "Ingen ed avlagd, ingen ed jag svär", english: "No oath given, no oath I swear", words: [], englishHL: [] },
  { swedish: "Kronan kommer ej från kyrkan", english: "The crown comes not from the church", words: ["ej", "kyrkan"], englishHL: ["not", "church"] },
  { swedish: "den kom direkt ifrån Gud", english: "it came directly from God", words: [], englishHL: [] },
];

const LYRICS_P2 = [
  { swedish: "Över Norden jag härskar", english: "Over the North I reign", words: ["härskar"], englishHL: ["reign"] },
  { swedish: "Med det arv som jag gavs", english: "With the heritage I was given", words: ["arv"], englishHL: ["heritage"] },
  { swedish: "Gång på gång, sjung Carolus sång", english: "Time and again, sing Carolus' song", words: ["gång"], englishHL: ["Time"] },
  { swedish: "Krigets konst jag behärskar", english: "The art of war I master", words: [], englishHL: [] },
  { swedish: "Låt mitt namn sprida skräck", english: "Let my name spread terror", words: ["skräck"], englishHL: ["terror"] },
  { swedish: "Gång på gång, sjung Carolus sång", english: "Time and again, sing Carolus' song", words: ["gång"], englishHL: ["Time"] },
  { swedish: "Än en gång, sjung Carolus sång", english: "Once more, sing Carolus' song", words: ["gång"], englishHL: ["Once"] },
];

const MC_QUESTIONS = [
  { word: "nalkas", options: ["conquers", "approaches", "falls", "swears"], correct: 1 },
  { word: "krönas", options: ["to surrender", "to march", "to be crowned", "to pray"], correct: 2 },
  { word: "härskar", options: ["reigns / rules", "destroys", "inherits", "suffers"], correct: 0 },
  { word: "arv", options: ["crown", "army", "heritage", "battle"], correct: 2 },
];

const TF_QUESTIONS = [
  { statement: "'ej' means 'not'", correct: true, word: "ej" },
  { statement: "'kyrkan' means 'the crown'", correct: false, word: "kyrkan" },
  { statement: "'skräck' means 'strength'", correct: false, word: "skräck" },
  { statement: "'gång' means 'time / occasion'", correct: true, word: "gång" },
];

// ============================================
// AUDIO PLAYER
// ============================================

function PlayButton({ src, label }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const { currentTime, duration } = audioRef.current;
    if (duration > 0) setProgress((currentTime / duration) * 100);
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !audioRef.current.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioRef.current.currentTime = pct * audioRef.current.duration;
  };

  return (
    <div>
      <audio ref={audioRef} src={src} onTimeUpdate={handleTimeUpdate} onEnded={() => { setPlaying(false); setProgress(0); }} />
      <button onClick={toggle}
        style={{ display: 'inline-block', backgroundColor: '#1a1a2e', color: '#fff', padding: '14px 28px', borderRadius: 40, fontWeight: 600, fontSize: 15, border: 'none', cursor: 'pointer' }}>
        {playing ? '⏸ Pause' : '▶ Play'} {label}
      </button>
      {(playing || progress > 0) && (
        <div onClick={handleSeek} style={{ marginTop: 12, height: 4, backgroundColor: 'rgba(26,26,46,0.12)', borderRadius: 2, cursor: 'pointer', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, backgroundColor: '#1a1a2e', borderRadius: 2, transition: 'width 0.2s linear' }} />
        </div>
      )}
    </div>
  );
}

function PlayButtonWhite({ src, label }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const { currentTime, duration } = audioRef.current;
    if (duration > 0) setProgress((currentTime / duration) * 100);
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !audioRef.current.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioRef.current.currentTime = pct * audioRef.current.duration;
  };

  return (
    <div>
      <audio ref={audioRef} src={src} onTimeUpdate={handleTimeUpdate} onEnded={() => { setPlaying(false); setProgress(0); }} />
      <button onClick={toggle}
        style={{ display: 'inline-block', backgroundColor: '#fff', color: '#1a1a2e', padding: '12px 24px', borderRadius: 40, fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer' }}>
        {playing ? '⏸ Pause' : '▶ Play'} {label}
      </button>
      {(playing || progress > 0) && (
        <div onClick={handleSeek} style={{ marginTop: 12, height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2, cursor: 'pointer', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, backgroundColor: '#fff', borderRadius: 2, transition: 'width 0.2s linear' }} />
        </div>
      )}
    </div>
  );
}

// ============================================
// SHARED NAVIGATION
// ============================================

function Nav({ onNext, onBack, nextLabel = "Continue" }) {
  const { isMobile } = useWindowSize();
  
  return (
    <div style={{ 
      position: 'fixed', 
      bottom: isMobile ? 16 : 32, 
      left: isMobile ? 16 : 32, 
      right: isMobile ? 16 : 32, 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      zIndex: 50,
      padding: isMobile ? '12px 16px' : 0,
      backgroundColor: isMobile ? 'rgba(232, 235, 244, 0.95)' : 'transparent',
      borderRadius: isMobile ? 12 : 0,
      backdropFilter: isMobile ? 'blur(10px)' : 'none',
    }}>
      <div>
        {onBack && (
          <button onClick={onBack} style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            color: '#8888a0', 
            fontSize: isMobile ? 15 : 14, 
            letterSpacing: '0.05em',
            padding: isMobile ? '8px 0' : 0,
          }}>
            ← Back
          </button>
        )}
      </div>
      <div>
        {onNext && (
          <button onClick={onNext} style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            color: '#1a1a2e', 
            fontSize: isMobile ? 15 : 14, 
            letterSpacing: '0.05em',
            padding: isMobile ? '8px 0' : 0,
            fontWeight: isMobile ? 600 : 400,
          }}>
            {nextLabel} →
          </button>
        )}
      </div>
    </div>
  );
}

function Dots({ current, total }) {
  const { isMobile } = useWindowSize();
  
  return (
    <div style={{ 
      position: 'fixed', 
      bottom: isMobile ? 70 : 32, 
      left: '50%', 
      transform: 'translateX(-50%)', 
      display: 'flex', 
      gap: isMobile ? 6 : 8, 
      zIndex: 50 
    }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ 
          height: isMobile ? 4 : 6, 
          borderRadius: 3, 
          transition: 'all 0.4s ease', 
          width: i === current ? (isMobile ? 24 : 32) : (isMobile ? 4 : 6), 
          backgroundColor: i === current ? '#1a1a2e' : 'rgba(26,26,46,0.15)' 
        }} />
      ))}
    </div>
  );
}

// ============================================
// TITLE
// ============================================

function TitleSlide({ onNext }) {
  const { isMobile, isTablet } = useWindowSize();
  
  const fontSize = isMobile ? 36 : isTablet ? 44 : 56;
  const imageHeight = isMobile ? 220 : isTablet ? 280 : 360;
  const padding = isMobile ? 20 : 32;
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#E8EBF4', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding 
    }}>
      <div style={{ maxWidth: 800, width: '100%' }}>
        <p style={{ 
          color: '#8888a0', 
          fontSize: isMobile ? 10 : 11, 
          letterSpacing: '0.2em', 
          marginBottom: isMobile ? 16 : 24 
        }}>
          SWEDISH THROUGH METAL
        </p>
        <img 
          src="/images/cathedral.jpg" 
          alt="Stockholm Cathedral, 1697" 
          style={{ 
            width: '100%', 
            height: imageHeight, 
            objectFit: 'cover', 
            objectPosition: 'center 20%', 
            borderRadius: 4 
          }} 
        />
        <div style={{ 
          marginTop: isMobile ? 24 : 48, 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between', 
          alignItems: isMobile ? 'flex-start' : 'flex-end',
          gap: isMobile ? 8 : 0,
        }}>
          <div>
            <h1 style={{ 
              fontFamily: 'Georgia, serif', 
              fontSize, 
              color: '#1a1a2e', 
              margin: 0, 
              lineHeight: 1.1 
            }}>
              Carolus Rex
            </h1>
            <p style={{ 
              color: '#8888a0', 
              fontSize: isMobile ? 13 : 14, 
              fontStyle: 'italic', 
              marginTop: 8 
            }}>
              The Last Viking
            </p>
          </div>
        </div>
      </div>
      <Nav onNext={onNext} nextLabel="Begin" />
    </div>
  );
}

// ============================================
// STORY SLIDES
// ============================================

function StorySlide1({ onNext, onBack }) {
  const { isMobile, isTablet } = useWindowSize();
  
  const headingSize = isMobile ? 32 : isTablet ? 40 : 48;
  const bodySize = isMobile ? 16 : 18;
  const padding = isMobile ? '24px 20px' : isTablet ? '32px 40px' : '32px 64px';
  const imageHeight = isMobile ? 280 : isTablet ? 400 : 520;
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#E8EBF4', padding }}>
      <div style={{ 
        maxWidth: 1100, 
        margin: '0 auto', 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
        gap: isMobile ? 32 : isTablet ? 40 : 64, 
        alignItems: 'center', 
        minHeight: isMobile ? 'auto' : '80vh',
        paddingBottom: isMobile ? 100 : 0,
      }}>
        <div style={{ order: isMobile ? 2 : 1 }}>
          <p style={{ color: '#8888a0', fontSize: isMobile ? 11 : 12, letterSpacing: '0.15em', marginBottom: isMobile ? 16 : 24 }}>I. THE BOY</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: headingSize, color: '#1a1a2e', marginBottom: isMobile ? 20 : 32, lineHeight: 1.1 }}>1697</h2>
          <p style={{ color: '#5c5c7a', fontSize: bodySize, lineHeight: 1.7, marginBottom: isMobile ? 16 : 24 }}>
            In 1697, the Swedish Empire was vast. Finland, Estonia, Latvia, parts of Germany. The Baltic Sea was essentially a Swedish lake.
          </p>
          <p style={{ color: '#5c5c7a', fontSize: bodySize, lineHeight: 1.7, marginBottom: 8 }}>
            Then the king died. The crown passed to his son, Karl XII.
          </p>
          <p style={{ color: '#1a1a2e', fontSize: isMobile ? 18 : 22, lineHeight: 1.7, marginBottom: isMobile ? 16 : 24, fontWeight: 700 }}>
            He was fifteen.
          </p>
          <p style={{ color: '#5c5c7a', lineHeight: 1.7, fontSize: isMobile ? 15 : 16 }}>
            They would come to call him "The Last Viking." "The Swedish Meteor."
          </p>
        </div>
        <img 
          src="/images/karl-xii.jpg" 
          alt="Karl XII" 
          style={{ 
            width: '100%', 
            height: imageHeight, 
            objectFit: 'cover', 
            objectPosition: 'center 70%', 
            borderRadius: 4,
            order: isMobile ? 1 : 2,
          }} 
        />
      </div>
      <Dots current={2} total={11} />
      <Nav onNext={onNext} onBack={onBack} />
    </div>
  );
}

function StorySlide2({ onNext, onBack }) {
  const { isMobile, isTablet } = useWindowSize();
  
  const headingSize = isMobile ? 28 : isTablet ? 36 : 44;
  const bodySize = isMobile ? 16 : 18;
  const padding = isMobile ? '24px 20px' : isTablet ? '32px 40px' : '32px 64px';
  const imageHeight = isMobile ? 250 : isTablet ? 340 : 420;
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F0EDE8', padding }}>
      <div style={{ 
        maxWidth: 1100, 
        margin: '0 auto', 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
        gap: isMobile ? 32 : isTablet ? 40 : 64, 
        alignItems: 'center', 
        minHeight: isMobile ? 'auto' : '80vh',
        paddingBottom: isMobile ? 100 : 0,
      }}>
        <img 
          src="/images/coronation.jpg" 
          alt="The coronation" 
          style={{ 
            width: '100%', 
            height: imageHeight, 
            objectFit: 'cover', 
            objectPosition: 'center 20%', 
            borderRadius: 4 
          }} 
        />
        <div>
          <p style={{ color: '#8888a0', fontSize: isMobile ? 11 : 12, letterSpacing: '0.15em', marginBottom: isMobile ? 16 : 24 }}>II. THE CROWN</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: headingSize, color: '#7c6a9c', marginBottom: 8, lineHeight: 1.1, fontStyle: 'italic' }}>
            Kronan kommer ej från kyrkan
          </h2>
          <p style={{ color: '#8888a0', fontSize: isMobile ? 14 : 16, fontStyle: 'italic', marginBottom: isMobile ? 20 : 32 }}>
            The crown comes not from the church
          </p>
          <p style={{ color: '#5c5c7a', fontSize: bodySize, lineHeight: 1.7, marginBottom: isMobile ? 16 : 24 }}>
            As the coronation reached its peak, Karl stepped toward the archbishop and instead of kneeling to receive the crown, he took it and placed it on his own head.
          </p>
          <p style={{ color: '#5c5c7a', lineHeight: 1.7, marginBottom: isMobile ? 16 : 24, fontSize: isMobile ? 15 : 16 }}>
            He then refused to swear an oath to the church, declaring that his crown came not from the church, but directly from God.
          </p>
          <p style={{ color: '#5c5c7a', lineHeight: 1.7, marginBottom: isMobile ? 16 : 24, fontSize: isMobile ? 15 : 16 }}>
            As a king, he was unique. He preferred to dress like a common soldier, eat with his men and sleep in the same tents. Never marrying.
          </p>
          <p style={{ color: '#5c5c7a', lineHeight: 1.7, fontSize: isMobile ? 15 : 16 }}>
            He said he was "married to his troops, in life and in death."
          </p>
        </div>
      </div>
      <Dots current={3} total={11} />
      <Nav onNext={onNext} onBack={onBack} />
    </div>
  );
}

function StorySlide3({ onNext, onBack }) {
  const { isMobile, isTablet } = useWindowSize();
  
  const headingSize = isMobile ? 32 : isTablet ? 40 : 48;
  const bodySize = isMobile ? 16 : 18;
  const padding = isMobile ? '24px 20px' : isTablet ? '32px 40px' : '32px 64px';
  const imageHeight = isMobile ? 220 : isTablet ? 320 : 400;
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#E8EBF4', padding }}>
      <div style={{ 
        maxWidth: 1100, 
        margin: '0 auto', 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
        gap: isMobile ? 32 : isTablet ? 40 : 64, 
        alignItems: 'center', 
        minHeight: isMobile ? 'auto' : '80vh',
        paddingBottom: isMobile ? 100 : 0,
      }}>
        <div style={{ order: isMobile ? 2 : 1 }}>
          <p style={{ color: '#8888a0', fontSize: isMobile ? 11 : 12, letterSpacing: '0.15em', marginBottom: isMobile ? 16 : 24 }}>III. THE LAST VIKING</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: headingSize, color: '#1a1a2e', marginBottom: isMobile ? 20 : 32, lineHeight: 1.1 }}>
            Young, but fierce
          </h2>
          <p style={{ color: '#5c5c7a', fontSize: bodySize, lineHeight: 1.8, marginBottom: 16 }}>
            The day he was crowned, three countries attacked Sweden at once. Denmark. Poland. Russia. They thought a child would be an easy target.
          </p>
          <p style={{ color: '#5c5c7a', fontSize: bodySize, lineHeight: 1.8, marginBottom: 16 }}>
            At 18, he defeated a Russian army four times his size - in a blizzard. He left Stockholm with his army and spent the next eighteen years fighting across Europe. Refusing to surrender. Refusing to negotiate.
          </p>
          <p style={{ color: '#5c5c7a', fontSize: bodySize, lineHeight: 1.8, marginBottom: 8 }}>
            In 1718, during a siege in Norway, he was struck by a bullet to the head.
          </p>
          <p style={{ color: '#1a1a2e', fontSize: isMobile ? 17 : 20, fontWeight: 700 }}>
            And so ended the reign of the Last Viking.
          </p>
        </div>
        <div style={{ order: isMobile ? 1 : 2 }}>
          <img 
            src="/images/cederstrom.jpg" 
            alt="Bringing Home the Body of King Karl XII" 
            style={{ 
              width: '100%', 
              height: imageHeight, 
              objectFit: 'cover', 
              objectPosition: 'center 20%', 
              borderRadius: 4 
            }} 
          />
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-around', 
            marginTop: isMobile ? 16 : 24 
          }}>
            {[{ n: "15", l: "crowned" }, { n: "18", l: "years at war" }, { n: "36", l: "died" }].map((d, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: isMobile ? 28 : 36, color: '#1a1a2e', margin: 0 }}>{d.n}</p>
                <p style={{ color: '#8888a0', fontSize: isMobile ? 11 : 12 }}>{d.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Dots current={4} total={11} />
      <Nav onNext={onNext} onBack={onBack} nextLabel="Learn the words" />
    </div>
  );
}

// ============================================
// BAND PAGE
// ============================================

function BandPage({ onNext, onBack }) {
  const { isMobile, isTablet } = useWindowSize();
  
  const padding = isMobile ? '24px 20px 120px' : isTablet ? '32px 40px 100px' : '32px 64px 100px';
  const headingSize = isMobile ? 32 : isTablet ? 40 : 48;
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#E8EBF4', padding }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <p style={{ color: '#8888a0', fontSize: isMobile ? 11 : 12, letterSpacing: '0.15em', marginBottom: isMobile ? 16 : 24 }}>THE BAND</p>
        
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: headingSize, color: '#1a1a2e', margin: 0, lineHeight: 1.1, marginBottom: isMobile ? 20 : 32 }}>Meet Sabaton</h2>

        <p style={{ color: '#5c5c7a', fontSize: isMobile ? 16 : 18, lineHeight: 1.8, marginBottom: isMobile ? 24 : 32 }}>
          Born in 1999 in the sleepy town of Falun, Sabaton has been turning the history you fell asleep reading into power metal anthems. From the Siege of Vienna to the last stand of the Swiss Guard—the boring history you never bothered to read? They made it loud.
        </p>

        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 8, overflow: 'hidden', marginBottom: isMobile ? 24 : 32 }}>
          <iframe
            src="https://www.youtube.com/embed/Us2ylGAwBnk"
            title="Sabaton - Carolus Rex"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: 8, padding: isMobile ? 20 : 24 }}>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: isMobile ? 18 : 22, color: '#7c6a9c', fontStyle: 'italic', margin: '0 0 8px' }}>
            Carolus Rex
          </p>
          <p style={{ color: '#5c5c7a', fontSize: isMobile ? 14 : 15, margin: 0 }}>
            The title track, sung in Swedish. Karl XII crowns himself, answering to no one but God.
          </p>
        </div>
      </div>
      <Dots current={1} total={11} />
      <Nav onNext={onNext} onBack={onBack} nextLabel="The story" />
    </div>
  );
}

// ============================================
// VOCAB
// ============================================

function VocabColumn({ words, label, isMobile }) {
  return (
    <div>
      <p style={{ color: '#8888a0', fontSize: isMobile ? 10 : 11, letterSpacing: '0.1em', marginBottom: isMobile ? 12 : 16 }}>{label}</p>
      {words.map((word, i) => {
        const c = COLORS[word.type];
        return (
          <div key={i} style={{ padding: isMobile ? '12px 0' : '14px 0', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: isMobile ? 8 : 10, marginBottom: 2, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: isMobile ? 22 : 26, color: c.text }}>{word.swedish}</span>
              <span style={{ fontSize: isMobile ? 10 : 11, padding: '2px 8px', borderRadius: 10, backgroundColor: c.bg, color: c.text }}>{word.type}</span>
            </div>
            <span style={{ color: '#5c5c7a', fontSize: isMobile ? 13 : 15 }}>{word.phonetic}</span>
            <p style={{ color: '#5c5c7a', fontSize: isMobile ? 14 : 16, margin: '4px 0 0' }}>{word.meaning}</p>
          </div>
        );
      })}
    </div>
  );
}

function VocabPage({ onNext, onBack }) {
  const { isMobile, isTablet } = useWindowSize();
  
  const padding = isMobile ? '32px 20px 120px' : isTablet ? '40px 40px 100px' : '48px 64px 100px';
  const headingSize = isMobile ? 32 : isTablet ? 38 : 44;
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', padding }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <p style={{ color: '#8888a0', fontSize: isMobile ? 11 : 12, letterSpacing: '0.15em', marginBottom: 8 }}>THE STORY'S LANGUAGE</p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: headingSize, color: '#1a1a2e', marginBottom: isMobile ? 28 : 40 }}>
          Words to listen for
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
          gap: isMobile ? 32 : 48 
        }}>
          <VocabColumn words={VOCAB_P1} label="PART 1 - THE VERSE" isMobile={isMobile} />
          <VocabColumn words={VOCAB_P2} label="PART 2 - THE CHORUS" isMobile={isMobile} />
        </div>
      </div>
      <Dots current={5} total={11} />
      <Nav onNext={onNext} onBack={onBack} nextLabel="Hear the song" />
    </div>
  );
}

// ============================================
// LYRICS RENDERER
// ============================================

function renderLyricLines(lines, isMobile) {
  return lines.map((line, i) => (
    <div key={i}>
      <p style={{ 
        fontFamily: 'Georgia, serif', 
        fontSize: isMobile ? 18 : 24, 
        color: '#1a1a2e', 
        margin: '0 0 4px', 
        lineHeight: 1.4 
      }}>
        {line.swedish.split(' ').map((token, j) => {
          const clean = token.toLowerCase().replace(/[,.:!?]/g, '');
          const matched = ALL_VOCAB.find(v => clean === v.swedish.toLowerCase());
          const isHL = line.words.some(w => clean === w.toLowerCase());
          if (isHL && matched) {
            const c = COLORS[matched.type];
            return <span key={j}><span style={{ fontWeight: 700, color: c.text, backgroundColor: c.bg, padding: '1px 6px', borderRadius: 4 }}>{token}</span>{' '}</span>;
          }
          return <span key={j}>{token} </span>;
        })}
      </p>
      <p style={{ fontSize: isMobile ? 13 : 14, margin: 0 }}>
        {line.english.split(' ').map((token, j) => {
          const clean = token.toLowerCase().replace(/[,.:!?']/g, '');
          const hlIndex = line.englishHL.findIndex(w => clean === w.toLowerCase());
          if (hlIndex !== -1) {
            const swWord = line.words[hlIndex];
            const matched = ALL_VOCAB.find(v => v.swedish.toLowerCase() === (swWord || '').toLowerCase());
            const c = matched ? COLORS[matched.type] : COLORS.other;
            return <span key={j} style={{ fontWeight: 600, color: c.text }}>{token}{' '}</span>;
          }
          return <span key={j} style={{ color: '#8888a0' }}>{token} </span>;
        })}
      </p>
    </div>
  ));
}

function VocabKey({ words, isMobile }) {
  return (
    <div style={{ backgroundColor: '#fff', padding: isMobile ? 16 : 24, borderRadius: 8 }}>
      <p style={{ color: '#8888a0', fontSize: isMobile ? 10 : 11, letterSpacing: '0.1em', marginBottom: isMobile ? 10 : 12 }}>VOCABULARY KEY</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 6 : 8 }}>
        {words.map((word, i) => {
          const c = COLORS[word.type];
          return (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
              <div>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: isMobile ? 14 : 16, color: c.text }}>{word.swedish}</span>
                <span style={{ color: '#5c5c7a', fontSize: isMobile ? 12 : 13, marginLeft: 6 }}>({word.phonetic})</span>
              </div>
              <span style={{ color: '#8888a0', fontSize: isMobile ? 12 : 13 }}>{word.meaning}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// LINE BY LINE - PART 1
// ============================================

function LyricsPage1({ onNext, onBack }) {
  const { isMobile, isTablet } = useWindowSize();
  
  const padding = isMobile ? '24px 20px 120px' : isTablet ? '32px 40px 100px' : '32px 64px 100px';
  const headingSize = isMobile ? 28 : isTablet ? 34 : 40;
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F0EDE8', padding }}>
      <div style={{ 
        maxWidth: 900, 
        margin: '0 auto', 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : '3fr 2fr', 
        gap: isMobile ? 24 : 48 
      }}>
        {/* Audio player at top on mobile */}
        {isMobile && (
          <div>
            <div style={{ backgroundColor: '#1a1a2e', padding: 24, borderRadius: 8, textAlign: 'center', marginBottom: 16 }}>
              <p style={{ color: '#8888a0', fontSize: 11, letterSpacing: '0.15em', marginBottom: 12 }}>LISTEN TO PART 1</p>
              <PlayButtonWhite src="/audio/verse.mp3" label="Verse" />
            </div>
          </div>
        )}
        
        <div>
          <p style={{ color: '#8888a0', fontSize: isMobile ? 11 : 12, letterSpacing: '0.15em', marginBottom: 8 }}>PART 1 - THE VERSE</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: headingSize, color: '#1a1a2e', marginBottom: 8 }}>Line by line</h2>
          <p style={{ color: '#5c5c7a', marginBottom: isMobile ? 24 : 36, fontSize: isMobile ? 14 : 16 }}>
            Key words <span style={{ fontWeight: 600, color: '#2d5a7b' }}>highlighted</span> to follow along.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 20 : 28 }}>
            {renderLyricLines(LYRICS_P1, isMobile)}
          </div>
        </div>
        
        {/* Sidebar on desktop/tablet */}
        {!isMobile && (
          <div style={{ position: 'sticky', top: 48, alignSelf: 'start' }}>
            <div style={{ backgroundColor: '#1a1a2e', padding: isTablet ? 24 : 32, borderRadius: 8, textAlign: 'center', marginBottom: 24 }}>
              <p style={{ color: '#8888a0', fontSize: 12, letterSpacing: '0.15em', marginBottom: 16 }}>LISTEN TO PART 1</p>
              <PlayButtonWhite src="/audio/verse.mp3" label="Verse" />
            </div>
            <VocabKey words={VOCAB_P1} isMobile={isMobile} />
          </div>
        )}
        
        {/* Vocab key at bottom on mobile */}
        {isMobile && (
          <VocabKey words={VOCAB_P1} isMobile={isMobile} />
        )}
      </div>
      <Dots current={6} total={11} />
      <Nav onNext={onNext} onBack={onBack} nextLabel="Part 2" />
    </div>
  );
}

// ============================================
// LINE BY LINE - PART 2
// ============================================

function LyricsPage2({ onNext, onBack }) {
  const { isMobile, isTablet } = useWindowSize();
  
  const padding = isMobile ? '24px 20px 120px' : isTablet ? '32px 40px 100px' : '32px 64px 100px';
  const headingSize = isMobile ? 28 : isTablet ? 34 : 40;
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F0EDE8', padding }}>
      <div style={{ 
        maxWidth: 900, 
        margin: '0 auto', 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : '3fr 2fr', 
        gap: isMobile ? 24 : 48 
      }}>
        {/* Audio player at top on mobile */}
        {isMobile && (
          <div>
            <div style={{ backgroundColor: '#1a1a2e', padding: 24, borderRadius: 8, textAlign: 'center', marginBottom: 16 }}>
              <p style={{ color: '#8888a0', fontSize: 11, letterSpacing: '0.15em', marginBottom: 12 }}>LISTEN TO PART 2</p>
              <PlayButtonWhite src="/audio/chorus.mp3" label="Chorus" />
            </div>
          </div>
        )}
        
        <div>
          <p style={{ color: '#8888a0', fontSize: isMobile ? 11 : 12, letterSpacing: '0.15em', marginBottom: 8 }}>PART 2 - THE CHORUS</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: headingSize, color: '#1a1a2e', marginBottom: 8 }}>Line by line</h2>
          <p style={{ color: '#5c5c7a', marginBottom: isMobile ? 20 : 28, fontSize: isMobile ? 14 : 16 }}>
            Key words <span style={{ fontWeight: 600, color: '#2d5a7b' }}>highlighted</span> to follow along.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 12 : 14 }}>
            {renderLyricLines(LYRICS_P2, isMobile)}
          </div>
        </div>
        
        {/* Sidebar on desktop/tablet */}
        {!isMobile && (
          <div style={{ position: 'sticky', top: 48, alignSelf: 'start' }}>
            <div style={{ backgroundColor: '#1a1a2e', padding: isTablet ? 24 : 32, borderRadius: 8, textAlign: 'center', marginBottom: 24 }}>
              <p style={{ color: '#8888a0', fontSize: 12, letterSpacing: '0.15em', marginBottom: 16 }}>LISTEN TO PART 2</p>
              <PlayButtonWhite src="/audio/chorus.mp3" label="Chorus" />
            </div>
            <VocabKey words={VOCAB_P2} isMobile={isMobile} />
          </div>
        )}
        
        {/* Vocab key at bottom on mobile */}
        {isMobile && (
          <VocabKey words={VOCAB_P2} isMobile={isMobile} />
        )}
      </div>
      <Dots current={7} total={11} />
      <Nav onNext={onNext} onBack={onBack} nextLabel="Quick check" />
    </div>
  );
}

// ============================================
// QUIZ
// ============================================

function QuizPage({ onNext, onBack }) {
  const { isMobile, isTablet } = useWindowSize();
  
  const padding = isMobile ? '24px 20px 120px' : isTablet ? '32px 40px 100px' : '32px 64px 100px';
  const headingSize = isMobile ? 28 : isTablet ? 34 : 40;
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', padding, overflowY: 'auto' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: isMobile ? 24 : 36, paddingBottom: isMobile ? 16 : 24, borderBottom: '2px solid #1a1a2e' }}>
          <p style={{ color: '#8888a0', fontSize: isMobile ? 10 : 11, letterSpacing: '0.2em', marginBottom: 8 }}>CAROLUS REX</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: headingSize, color: '#1a1a2e', marginBottom: 0 }}>Quick check</h2>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
          gap: isMobile ? 32 : 48 
        }}>
          {/* Part 1 - Multiple Choice */}
          <div>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: isMobile ? 16 : 18, color: '#1a1a2e', marginBottom: 4 }}>Part 1</p>
            <p style={{ color: '#8888a0', fontSize: isMobile ? 12 : 13, marginBottom: isMobile ? 16 : 24 }}>Fill in the circle next to the correct answer.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 16 : 12 }}>
              {MC_QUESTIONS.map((q, qi) => {
                const word = ALL_VOCAB.find(v => v.swedish === q.word);
                const c = word ? COLORS[word.type] : COLORS.other;
                return (
                  <div key={qi} style={{ paddingBottom: isMobile ? 12 : 8, borderBottom: '1px solid #f0f0f0' }}>
                    <p style={{ margin: '0 0 4px' }}>
                      <span style={{ fontFamily: 'Georgia, serif', fontSize: isMobile ? 18 : 20, color: c.text, fontWeight: 600 }}>{qi + 1}. {q.word}</span>
                    </p>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
                      gap: isMobile ? '8px 0' : '4px 24px', 
                      paddingLeft: isMobile ? 12 : 20 
                    }}>
                      {q.options.map((opt, oi) => (
                        <p key={oi} style={{ margin: 0, color: '#5c5c7a', fontSize: isMobile ? 14 : 15, padding: '4px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ display: 'inline-block', width: isMobile ? 20 : 18, height: isMobile ? 20 : 18, borderRadius: 10, border: '2px solid #c0c0c0', flexShrink: 0 }} />
                          {opt}
                        </p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Part 2 - True/False */}
          <div>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: isMobile ? 16 : 18, color: '#1a1a2e', marginBottom: 4 }}>Part 2</p>
            <p style={{ color: '#8888a0', fontSize: isMobile ? 12 : 13, marginBottom: isMobile ? 16 : 24 }}>Fill in T for true or F for false.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {TF_QUESTIONS.map((q, qi) => {
                const word = ALL_VOCAB.find(v => v.swedish === q.word);
                const c = word ? COLORS[word.type] : COLORS.other;
                return (
                  <div key={qi} style={{ 
                    display: 'flex', 
                    alignItems: isMobile ? 'flex-start' : 'center', 
                    justifyContent: 'space-between', 
                    padding: isMobile ? '12px 0' : '14px 0', 
                    borderBottom: '1px solid #f0f0f0',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: isMobile ? 8 : 0,
                  }}>
                    <p style={{ margin: 0, fontSize: isMobile ? 14 : 15 }}>
                      <span style={{ color: '#8888a0', marginRight: 8 }}>{MC_QUESTIONS.length + qi + 1}.</span>
                      <span style={{ fontFamily: 'Georgia, serif', color: c.text, fontWeight: 600 }}>{q.word}</span>
                      <span style={{ color: '#5c5c7a' }}> means {q.statement.replace(`'${q.word}' means `, '')}</span>
                    </p>
                    <div style={{ display: 'flex', gap: 12, flexShrink: 0, marginLeft: isMobile ? 24 : 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ display: 'inline-block', width: isMobile ? 20 : 18, height: isMobile ? 20 : 18, borderRadius: 10, border: '2px solid #c0c0c0' }} />
                        <span style={{ color: '#8888a0', fontSize: 13 }}>T</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ display: 'inline-block', width: isMobile ? 20 : 18, height: isMobile ? 20 : 18, borderRadius: 10, border: '2px solid #c0c0c0' }} />
                        <span style={{ color: '#8888a0', fontSize: 13 }}>F</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: isMobile ? 32 : 48, paddingTop: isMobile ? 16 : 24, borderTop: '2px solid #1a1a2e' }}>
              <p style={{ color: '#8888a0', fontSize: isMobile ? 12 : 13, margin: 0 }}>Total: ......... / {MC_QUESTIONS.length + TF_QUESTIONS.length}</p>
            </div>
          </div>
        </div>

      </div>
      <Dots current={8} total={11} />
      <Nav onNext={onNext} onBack={onBack} nextLabel="Answers" />
    </div>
  );
}

// ============================================
// ANSWERS
// ============================================

function AnswersPage({ onNext, onBack }) {
  const { isMobile, isTablet } = useWindowSize();
  
  const padding = isMobile ? '24px 20px 120px' : isTablet ? '32px 40px 100px' : '32px 64px 100px';
  const headingSize = isMobile ? 28 : isTablet ? 34 : 40;
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', padding, overflowY: 'auto' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: isMobile ? 24 : 36, paddingBottom: isMobile ? 16 : 24, borderBottom: '2px solid #1a1a2e' }}>
          <p style={{ color: '#8888a0', fontSize: isMobile ? 10 : 11, letterSpacing: '0.2em', marginBottom: 8 }}>CAROLUS REX</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: headingSize, color: '#1a1a2e' }}>Answers</h2>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
          gap: isMobile ? 32 : 48 
        }}>
          <div>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: isMobile ? 16 : 18, color: '#1a1a2e', marginBottom: isMobile ? 16 : 24 }}>Part 1</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 12 : 16 }}>
              {MC_QUESTIONS.map((q, qi) => {
                const word = ALL_VOCAB.find(v => v.swedish === q.word);
                const c = word ? COLORS[word.type] : COLORS.other;
                return (
                  <div key={qi} style={{ 
                    display: 'flex', 
                    alignItems: 'baseline', 
                    gap: isMobile ? 8 : 12, 
                    padding: isMobile ? '10px 0' : '12px 0', 
                    borderBottom: '1px solid #f0f0f0',
                    flexWrap: 'wrap',
                  }}>
                    <span style={{ color: '#8888a0', fontSize: isMobile ? 13 : 14, minWidth: 24 }}>{qi + 1}.</span>
                    <span style={{ fontFamily: 'Georgia, serif', fontSize: isMobile ? 18 : 20, color: c.text, fontWeight: 600 }}>{q.word}</span>
                    <span style={{ color: '#5c5c7a', fontSize: isMobile ? 14 : 16 }}>=</span>
                    <span style={{ color: '#1a1a2e', fontSize: isMobile ? 14 : 16, fontWeight: 600 }}>{q.options[q.correct]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: isMobile ? 16 : 18, color: '#1a1a2e', marginBottom: isMobile ? 16 : 24 }}>Part 2</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 12 : 16 }}>
              {TF_QUESTIONS.map((q, qi) => {
                const word = ALL_VOCAB.find(v => v.swedish === q.word);
                const c = word ? COLORS[word.type] : COLORS.other;
                return (
                  <div key={qi} style={{ 
                    display: 'flex', 
                    alignItems: isMobile ? 'flex-start' : 'baseline', 
                    justifyContent: 'space-between', 
                    padding: isMobile ? '10px 0' : '12px 0', 
                    borderBottom: '1px solid #f0f0f0',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: isMobile ? 6 : 0,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ color: '#8888a0', fontSize: isMobile ? 13 : 14 }}>{MC_QUESTIONS.length + qi + 1}.</span>
                      <span style={{ fontFamily: 'Georgia, serif', color: c.text, fontWeight: 600, fontSize: isMobile ? 16 : 18 }}>{q.word}</span>
                      <span style={{ color: '#5c5c7a', fontSize: isMobile ? 13 : 15 }}>{q.statement.replace(`'${q.word}' `, '')}</span>
                    </div>
                    <span style={{ 
                      fontWeight: 700, 
                      fontSize: isMobile ? 16 : 18, 
                      color: q.correct ? '#2d7b3a' : '#b03030', 
                      marginLeft: isMobile ? 24 : 16 
                    }}>
                      {q.correct ? 'TRUE' : 'FALSE'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
      <Dots current={9} total={11} />
      <Nav onNext={onNext} onBack={onBack} nextLabel="Finish" />
    </div>
  );
}

// ============================================
// END - YOUTUBE + RECAP
// ============================================

function EndSlide({ onRestart, onBack }) {
  const { isMobile, isTablet } = useWindowSize();
  
  const padding = isMobile ? '32px 20px 120px' : isTablet ? '40px 40px 100px' : '48px 64px 100px';
  const headingSize = isMobile ? 32 : isTablet ? 40 : 48;
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#E8EBF4', padding }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <p style={{ color: '#8888a0', fontSize: isMobile ? 11 : 12, letterSpacing: '0.15em', marginBottom: 8 }}>THE FULL SONG</p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: headingSize, color: '#1a1a2e', marginBottom: isMobile ? 20 : 32, lineHeight: 1.1 }}>Carolus Rex</h2>

        <div style={{ 
          position: 'relative', 
          paddingBottom: '56.25%', 
          height: 0, 
          borderRadius: 8, 
          overflow: 'hidden', 
          marginBottom: isMobile ? 28 : 40 
        }}>
          <iframe
            src="https://www.youtube.com/embed/HIuWMI0zpiU"
            title="Sabaton - Carolus Rex"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <p style={{ color: '#8888a0', fontSize: isMobile ? 13 : 14, marginBottom: isMobile ? 16 : 24 }}>What we covered</p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? 8 : 10, marginBottom: isMobile ? 28 : 40 }}>
          {ALL_VOCAB.map((word, i) => {
            const c = COLORS[word.type];
            return (
              <div key={i} style={{ 
                backgroundColor: '#fff', 
                borderRadius: 8, 
                padding: isMobile ? '8px 12px' : '10px 16px', 
                display: 'flex', 
                alignItems: 'baseline', 
                gap: isMobile ? 6 : 8 
              }}>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: isMobile ? 15 : 18, color: c.text }}>{word.swedish}</span>
                <span style={{ color: '#8888a0', fontSize: isMobile ? 11 : 13 }}>{word.meaning}</span>
              </div>
            );
          })}
        </div>

        <p style={{ color: '#7c6a9c', fontFamily: 'Georgia, serif', fontSize: isMobile ? 17 : 20, fontStyle: 'italic' }}>
          Gång på gång, sjung Carolus sång
        </p>
      </div>
      <Dots current={10} total={11} />
      <div style={{ 
        position: 'fixed', 
        bottom: isMobile ? 16 : 32, 
        left: isMobile ? 16 : 32, 
        right: isMobile ? 16 : 32, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        zIndex: 50,
        padding: isMobile ? '12px 16px' : 0,
        backgroundColor: isMobile ? 'rgba(232, 235, 244, 0.95)' : 'transparent',
        borderRadius: isMobile ? 12 : 0,
        backdropFilter: isMobile ? 'blur(10px)' : 'none',
      }}>
        <div>
          {onBack && (
            <button onClick={onBack} style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              color: '#8888a0', 
              fontSize: isMobile ? 15 : 14, 
              letterSpacing: '0.05em',
              padding: isMobile ? '8px 0' : 0,
            }}>
              ← Back
            </button>
          )}
        </div>
        <div>
          <button onClick={onRestart} style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            color: '#1a1a2e', 
            fontSize: isMobile ? 15 : 14, 
            letterSpacing: '0.05em',
            padding: isMobile ? '8px 0' : 0,
            fontWeight: isMobile ? 600 : 400,
          }}>
            Start again →
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN
// ============================================

export default function App() {
  const [slide, setSlide] = useState(0);
  const next = () => setSlide(s => s + 1);
  const back = () => setSlide(s => Math.max(0, s - 1));
  const restart = () => setSlide(0);

  const slides = [
    <TitleSlide key={0} onNext={next} />,
    <BandPage key={1} onNext={next} onBack={back} />,
    <StorySlide1 key={2} onNext={next} onBack={back} />,
    <StorySlide2 key={3} onNext={next} onBack={back} />,
    <StorySlide3 key={4} onNext={next} onBack={back} />,
    <VocabPage key={5} onNext={next} onBack={back} />,
    <LyricsPage1 key={6} onNext={next} onBack={back} />,
    <LyricsPage2 key={7} onNext={next} onBack={back} />,
    <QuizPage key={8} onNext={next} onBack={back} />,
    <AnswersPage key={9} onNext={next} onBack={back} />,
    <EndSlide key={10} onRestart={restart} onBack={back} />,
  ];

  return <div>{slides[slide]}</div>;
}