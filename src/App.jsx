import { useState, useRef } from 'react';

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
// SHARED
// ============================================

function Nav({ onNext, onBack, nextLabel = "Continue" }) {
  return (
    <div style={{ position: 'fixed', bottom: 32, left: 32, right: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 50 }}>
      <div>{onBack && <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8888a0', fontSize: 14, letterSpacing: '0.05em' }}>← Back</button>}</div>
      <div>{onNext && <button onClick={onNext} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1a1a2e', fontSize: 14, letterSpacing: '0.05em' }}>{nextLabel} →</button>}</div>
    </div>
  );
}

function Dots({ current, total }) {
  return (
    <div style={{ position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 50 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ height: 6, borderRadius: 3, transition: 'all 0.4s ease', width: i === current ? 32 : 6, backgroundColor: i === current ? '#1a1a2e' : 'rgba(26,26,46,0.15)' }} />
      ))}
    </div>
  );
}

// ============================================
// TITLE
// ============================================

function TitleSlide({ onNext }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#E8EBF4', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <div style={{ maxWidth: 800, width: '100%' }}>
        <p style={{ color: '#8888a0', fontSize: 11, letterSpacing: '0.2em', marginBottom: 24 }}>SWEDISH THROUGH METAL</p>
        <img src="/images/cathedral.jpg" alt="Stockholm Cathedral, 1697" style={{ width: '100%', height: 360, objectFit: 'cover', objectPosition: 'top', borderRadius: 4 }} />
        <div style={{ marginTop: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 56, color: '#1a1a2e', margin: 0, lineHeight: 1.1 }}>Carolus Rex</h1>
            <p style={{ color: '#8888a0', fontSize: 14, fontStyle: 'italic', marginTop: 8 }}>The Last Viking</p>
          </div>
        </div>
      </div>
      <Nav onNext={onNext} nextLabel="Begin" />
    </div>
  );
}

// ============================================
// STORY
// ============================================

function StorySlide1({ onNext, onBack }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#E8EBF4', padding: '32px 64px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center', minHeight: '80vh' }}>
        <div>
          <p style={{ color: '#8888a0', fontSize: 12, letterSpacing: '0.15em', marginBottom: 24 }}>I. THE BOY</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 48, color: '#1a1a2e', marginBottom: 32, lineHeight: 1.1 }}>1697</h2>
          <p style={{ color: '#5c5c7a', fontSize: 18, lineHeight: 1.7, marginBottom: 24 }}>In 1697, the Swedish Empire was vast. Finland, Estonia, Latvia, parts of Germany. The Baltic Sea was essentially a Swedish lake.</p>
          <p style={{ color: '#5c5c7a', fontSize: 18, lineHeight: 1.7, marginBottom: 8 }}>Then the king died. The crown passed to his son, Karl XII.</p>
          <p style={{ color: '#1a1a2e', fontSize: 22, lineHeight: 1.7, marginBottom: 24, fontWeight: 700 }}>He was fifteen.</p>
          <p style={{ color: '#5c5c7a', lineHeight: 1.7 }}>They would come to call him "The Last Viking." "The Swedish Meteor."</p>
        </div>
        <img src="/images/karl-xii.jpg" alt="Karl XII" style={{ width: '100%', height: 420, objectFit: 'cover', objectPosition: 'top', borderRadius: 4 }} />
      </div>
      <Dots current={1} total={10} />
      <Nav onNext={onNext} onBack={onBack} />
    </div>
  );
}

function StorySlide2({ onNext, onBack }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F0EDE8', padding: '32px 64px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center', minHeight: '80vh' }}>
        <img src="/images/coronation.jpg" alt="The coronation" style={{ width: '100%', height: 420, objectFit: 'cover', objectPosition: 'top', borderRadius: 4 }} />
        <div>
          <p style={{ color: '#8888a0', fontSize: 12, letterSpacing: '0.15em', marginBottom: 24 }}>II. THE CROWN</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 44, color: '#7c6a9c', marginBottom: 8, lineHeight: 1.1, fontStyle: 'italic' }}>Kronan kommer ej från kyrkan</h2>
          <p style={{ color: '#8888a0', fontSize: 16, fontStyle: 'italic', marginBottom: 32 }}>The crown comes not from the church</p>
          <p style={{ color: '#5c5c7a', fontSize: 18, lineHeight: 1.7, marginBottom: 24 }}>As the coronation reached its peak, Karl stepped toward the archbishop and instead of kneeling to receive the crown, he took it and placed it on his own head.</p>
          <p style={{ color: '#5c5c7a', lineHeight: 1.7, marginBottom: 24 }}>He then refused to swear an oath to the church, declaring that his crown came not from the church, but directly from God.</p>
          <p style={{ color: '#5c5c7a', lineHeight: 1.7, marginBottom: 24 }}>As a king, he was unique. He preferred to dress like a common soldier, eat with his men and sleep in the same tents. Never marrying.</p>
          <p style={{ color: '#5c5c7a', lineHeight: 1.7 }}>He said he was "married to his troops, in life and in death."</p>
        </div>
      </div>
      <Dots current={2} total={10} />
      <Nav onNext={onNext} onBack={onBack} />
    </div>
  );
}

function StorySlide3({ onNext, onBack }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#E8EBF4', padding: '32px 64px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center', minHeight: '80vh' }}>
        <div>
          <p style={{ color: '#8888a0', fontSize: 12, letterSpacing: '0.15em', marginBottom: 24 }}>III. THE LAST VIKING</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 48, color: '#1a1a2e', marginBottom: 32, lineHeight: 1.1 }}>Young, but fierce</h2>
          <p style={{ color: '#5c5c7a', fontSize: 18, lineHeight: 1.8, marginBottom: 16 }}>
            The day he was crowned, three countries attacked Sweden at once. Denmark. Poland. Russia. They thought a child would be an easy target.
          </p>
          <p style={{ color: '#5c5c7a', fontSize: 18, lineHeight: 1.8, marginBottom: 16 }}>
            At 18, he defeated a Russian army four times his size - in a blizzard. He left Stockholm with his army and spent the next eighteen years fighting across Europe. Refusing to surrender. Refusing to negotiate.
          </p>
          <p style={{ color: '#5c5c7a', fontSize: 18, lineHeight: 1.8, marginBottom: 8 }}>
            In 1718, during a siege in Norway, he was struck by a bullet to the head.
          </p>
          <p style={{ color: '#1a1a2e', fontSize: 20, fontWeight: 700 }}>And so ended the reign of the Last Viking.</p>
        </div>
        <div>
          <img src="/images/cederstrom.jpg" alt="Bringing Home the Body of King Karl XII" style={{ width: '100%', height: 400, objectFit: 'cover', objectPosition: 'top', borderRadius: 4 }} />
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 24 }}>
            {[{ n: "15", l: "crowned" }, { n: "18", l: "years at war" }, { n: "36", l: "died" }].map((d, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: 36, color: '#1a1a2e', margin: 0 }}>{d.n}</p>
                <p style={{ color: '#8888a0', fontSize: 12 }}>{d.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Dots current={3} total={10} />
      <Nav onNext={onNext} onBack={onBack} nextLabel="Learn the music" />
    </div>
  );
}

// ============================================
// VOCAB
// ============================================

function VocabColumn({ words, label }) {
  return (
    <div>
      <p style={{ color: '#8888a0', fontSize: 11, letterSpacing: '0.1em', marginBottom: 16 }}>{label}</p>
      {words.map((word, i) => {
        const c = COLORS[word.type];
        return (
          <div key={i} style={{ padding: '14px 0', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 2 }}>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: 26, color: c.text }}>{word.swedish}</span>
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, backgroundColor: c.bg, color: c.text }}>{word.type}</span>
            </div>
            <span style={{ color: '#5c5c7a', fontSize: 15 }}>{word.phonetic}</span>
            <p style={{ color: '#5c5c7a', fontSize: 16, margin: '4px 0 0' }}>{word.meaning}</p>
          </div>
        );
      })}
    </div>
  );
}

function VocabPage({ onNext, onBack }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', padding: '48px 64px 100px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <p style={{ color: '#8888a0', fontSize: 12, letterSpacing: '0.15em', marginBottom: 8 }}>THE STORY'S LANGUAGE</p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 44, color: '#1a1a2e', marginBottom: 40 }}>Words to listen for</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
          <VocabColumn words={VOCAB_P1} label="PART 1 - THE VERSE" />
          <VocabColumn words={VOCAB_P2} label="PART 2 - THE CHORUS" />
        </div>
      </div>
      <Dots current={4} total={10} />
      <Nav onNext={onNext} onBack={onBack} nextLabel="Hear the song" />
    </div>
  );
}

// ============================================
// FIRST LISTEN
// ============================================

function FirstListen({ onNext, onBack }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#E8EBF4', padding: '48px 64px 100px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <p style={{ color: '#8888a0', fontSize: 12, letterSpacing: '0.15em', marginBottom: 8 }}>FIRST LISTEN</p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 48, color: '#1a1a2e', marginBottom: 8, lineHeight: 1.1 }}>Hear the words</h2>
        <p style={{ color: '#5c5c7a', fontSize: 18, marginBottom: 48 }}>
          Just try to hear the words. Don't worry about anything else yet.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: 8, padding: 32 }}>
            <p style={{ color: '#8888a0', fontSize: 11, letterSpacing: '0.1em', marginBottom: 20 }}>PART 1 - THE VERSE</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
              {VOCAB_P1.map((word, i) => {
                const c = COLORS[word.type];
                return <span key={i} style={{ backgroundColor: c.bg, color: c.text, padding: '6px 14px', borderRadius: 16, fontSize: 14, fontFamily: 'Georgia, serif' }}>{word.swedish}</span>;
              })}
            </div>
            <PlayButton src="/audio/verse.mp3" label="Verse" />
          </div>

          <div style={{ backgroundColor: '#ffffff', borderRadius: 8, padding: 32 }}>
            <p style={{ color: '#8888a0', fontSize: 11, letterSpacing: '0.1em', marginBottom: 20 }}>PART 2 - THE CHORUS</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
              {VOCAB_P2.map((word, i) => {
                const c = COLORS[word.type];
                return <span key={i} style={{ backgroundColor: c.bg, color: c.text, padding: '6px 14px', borderRadius: 16, fontSize: 14, fontFamily: 'Georgia, serif' }}>{word.swedish}</span>;
              })}
            </div>
            <PlayButton src="/audio/chorus.mp3" label="Chorus" />
          </div>
        </div>
      </div>
      <Dots current={5} total={10} />
      <Nav onNext={onNext} onBack={onBack} />
    </div>
  );
}

// ============================================
// LYRICS RENDERER
// ============================================

function renderLyricLines(lines) {
  return lines.map((line, i) => (
    <div key={i}>
      <p style={{ fontFamily: 'Georgia, serif', fontSize: 24, color: '#1a1a2e', margin: '0 0 4px', lineHeight: 1.4 }}>
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
      <p style={{ fontSize: 14, margin: 0 }}>
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

function VocabKey({ words }) {
  return (
    <div style={{ backgroundColor: '#fff', padding: 24, borderRadius: 8 }}>
      <p style={{ color: '#8888a0', fontSize: 11, letterSpacing: '0.1em', marginBottom: 12 }}>VOCABULARY KEY</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {words.map((word, i) => {
          const c = COLORS[word.type];
          return (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: 16, color: c.text }}>{word.swedish}</span>
                <span style={{ color: '#5c5c7a', fontSize: 13, marginLeft: 6 }}>({word.phonetic})</span>
              </div>
              <span style={{ color: '#8888a0', fontSize: 13 }}>{word.meaning}</span>
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
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F0EDE8', padding: '32px 64px 100px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 48 }}>
        <div>
          <p style={{ color: '#8888a0', fontSize: 12, letterSpacing: '0.15em', marginBottom: 8 }}>PART 1 - THE VERSE</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 40, color: '#1a1a2e', marginBottom: 8 }}>Line by line</h2>
          <p style={{ color: '#5c5c7a', marginBottom: 36 }}>Key words <span style={{ fontWeight: 600, color: '#2d5a7b' }}>highlighted</span> to follow along.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {renderLyricLines(LYRICS_P1)}
          </div>
        </div>
        <div style={{ position: 'sticky', top: 48, alignSelf: 'start' }}>
          <div style={{ backgroundColor: '#1a1a2e', padding: 32, borderRadius: 8, textAlign: 'center', marginBottom: 24 }}>
            <p style={{ color: '#8888a0', fontSize: 12, letterSpacing: '0.15em', marginBottom: 16 }}>LISTEN TO PART 1</p>
            <PlayButtonWhite src="/audio/verse.mp3" label="Verse" />
          </div>
          <VocabKey words={VOCAB_P1} />
        </div>
      </div>
      <Dots current={5} total={10} />
      <Nav onNext={onNext} onBack={onBack} nextLabel="Part 2" />
    </div>
  );
}

// ============================================
// LINE BY LINE - PART 2
// ============================================

function LyricsPage2({ onNext, onBack }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F0EDE8', padding: '32px 64px 100px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 48 }}>
        <div>
          <p style={{ color: '#8888a0', fontSize: 12, letterSpacing: '0.15em', marginBottom: 8 }}>PART 2 - THE CHORUS</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 40, color: '#1a1a2e', marginBottom: 8 }}>Line by line</h2>
          <p style={{ color: '#5c5c7a', marginBottom: 28 }}>Key words <span style={{ fontWeight: 600, color: '#2d5a7b' }}>highlighted</span> to follow along.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {renderLyricLines(LYRICS_P2)}
          </div>
        </div>
        <div style={{ position: 'sticky', top: 48, alignSelf: 'start' }}>
          <div style={{ backgroundColor: '#1a1a2e', padding: 32, borderRadius: 8, textAlign: 'center', marginBottom: 24 }}>
            <p style={{ color: '#8888a0', fontSize: 12, letterSpacing: '0.15em', marginBottom: 16 }}>LISTEN TO PART 2</p>
            <PlayButtonWhite src="/audio/chorus.mp3" label="Chorus" />
          </div>
          <VocabKey words={VOCAB_P2} />
        </div>
      </div>
      <Dots current={6} total={10} />
      <Nav onNext={onNext} onBack={onBack} nextLabel="Quick check" />
    </div>
  );
}

// ============================================
// QUIZ
// ============================================

function QuizPage({ onNext, onBack }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', padding: '32px 64px 100px', overflowY: 'auto' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: 36, paddingBottom: 24, borderBottom: '2px solid #1a1a2e' }}>
          <p style={{ color: '#8888a0', fontSize: 11, letterSpacing: '0.2em', marginBottom: 8 }}>CAROLUS REX</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 40, color: '#1a1a2e', marginBottom: 12 }}>Quick check</h2>
          <p style={{ color: '#8888a0', fontSize: 14, margin: 0 }}>Name: ..........................</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
          <div>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#1a1a2e', marginBottom: 4 }}>Part 1</p>
            <p style={{ color: '#8888a0', fontSize: 13, marginBottom: 24 }}>Fill in the circle next to the correct answer.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {MC_QUESTIONS.map((q, qi) => {
                const word = ALL_VOCAB.find(v => v.swedish === q.word);
                const c = word ? COLORS[word.type] : COLORS.other;
                return (
                  <div key={qi} style={{ paddingBottom: 16, borderBottom: '1px solid #f0f0f0' }}>
                    <p style={{ margin: '0 0 10px' }}>
                      <span style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: c.text, fontWeight: 600 }}>{qi + 1}. {q.word}</span>
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 24px', paddingLeft: 20 }}>
                      {q.options.map((opt, oi) => (
                        <p key={oi} style={{ margin: 0, color: '#5c5c7a', fontSize: 15, padding: '4px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ display: 'inline-block', width: 18, height: 18, borderRadius: 9, border: '2px solid #c0c0c0', flexShrink: 0 }} />
                          {opt}
                        </p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#1a1a2e', marginBottom: 4 }}>Part 2</p>
            <p style={{ color: '#8888a0', fontSize: 13, marginBottom: 24 }}>Fill in T for true or F for false.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {TF_QUESTIONS.map((q, qi) => {
                const word = ALL_VOCAB.find(v => v.swedish === q.word);
                const c = word ? COLORS[word.type] : COLORS.other;
                return (
                  <div key={qi} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <p style={{ margin: 0, fontSize: 15 }}>
                      <span style={{ color: '#8888a0', marginRight: 8 }}>{MC_QUESTIONS.length + qi + 1}.</span>
                      <span style={{ fontFamily: 'Georgia, serif', color: c.text, fontWeight: 600 }}>{q.word}</span>
                      <span style={{ color: '#5c5c7a' }}> means {q.statement.replace(`'${q.word}' means `, '')}</span>
                    </p>
                    <div style={{ display: 'flex', gap: 12, flexShrink: 0, marginLeft: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ display: 'inline-block', width: 18, height: 18, borderRadius: 9, border: '2px solid #c0c0c0' }} />
                        <span style={{ color: '#8888a0', fontSize: 13 }}>T</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ display: 'inline-block', width: 18, height: 18, borderRadius: 9, border: '2px solid #c0c0c0' }} />
                        <span style={{ color: '#8888a0', fontSize: 13 }}>F</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 48, paddingTop: 24, borderTop: '2px solid #1a1a2e' }}>
              <p style={{ color: '#8888a0', fontSize: 13, margin: 0 }}>Total: ......... / {MC_QUESTIONS.length + TF_QUESTIONS.length}</p>
            </div>
          </div>
        </div>

      </div>
      <Dots current={7} total={10} />
      <Nav onNext={onNext} onBack={onBack} nextLabel="Answers" />
    </div>
  );
}

// ============================================
// ANSWERS
// ============================================

function AnswersPage({ onNext, onBack }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', padding: '32px 64px 100px', overflowY: 'auto' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: 36, paddingBottom: 24, borderBottom: '2px solid #1a1a2e' }}>
          <p style={{ color: '#8888a0', fontSize: 11, letterSpacing: '0.2em', marginBottom: 8 }}>CAROLUS REX</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 40, color: '#1a1a2e' }}>Answers</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
          <div>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#1a1a2e', marginBottom: 24 }}>Part 1</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {MC_QUESTIONS.map((q, qi) => {
                const word = ALL_VOCAB.find(v => v.swedish === q.word);
                const c = word ? COLORS[word.type] : COLORS.other;
                return (
                  <div key={qi} style={{ display: 'flex', alignItems: 'baseline', gap: 12, padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <span style={{ color: '#8888a0', fontSize: 14, minWidth: 24 }}>{qi + 1}.</span>
                    <span style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: c.text, fontWeight: 600 }}>{q.word}</span>
                    <span style={{ color: '#5c5c7a', fontSize: 16 }}>=</span>
                    <span style={{ color: '#1a1a2e', fontSize: 16, fontWeight: 600 }}>{q.options[q.correct]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#1a1a2e', marginBottom: 24 }}>Part 2</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {TF_QUESTIONS.map((q, qi) => {
                const word = ALL_VOCAB.find(v => v.swedish === q.word);
                const c = word ? COLORS[word.type] : COLORS.other;
                return (
                  <div key={qi} style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                      <span style={{ color: '#8888a0', fontSize: 14 }}>{MC_QUESTIONS.length + qi + 1}.</span>
                      <span style={{ fontFamily: 'Georgia, serif', color: c.text, fontWeight: 600 }}>{q.word}</span>
                      <span style={{ color: '#5c5c7a', fontSize: 15 }}>{q.statement.replace(`'${q.word}' `, '')}</span>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 18, color: q.correct ? '#2d7b3a' : '#b03030', marginLeft: 16 }}>
                      {q.correct ? 'TRUE' : 'FALSE'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
      <Dots current={8} total={10} />
      <Nav onNext={onNext} onBack={onBack} nextLabel="Finish" />
    </div>
  );
}

// ============================================
// END - YOUTUBE + RECAP
// ============================================

function EndSlide({ onRestart, onBack }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#E8EBF4', padding: '48px 64px 100px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <p style={{ color: '#8888a0', fontSize: 12, letterSpacing: '0.15em', marginBottom: 8 }}>THE FULL SONG</p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 48, color: '#1a1a2e', marginBottom: 32, lineHeight: 1.1 }}>Carolus Rex</h2>

        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 8, overflow: 'hidden', marginBottom: 40 }}>
          <iframe
            src="https://www.youtube.com/embed/HIuWMI0zpiU"
            title="Sabaton - Carolus Rex"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <p style={{ color: '#8888a0', fontSize: 14, marginBottom: 24 }}>What we covered</p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 40 }}>
          {ALL_VOCAB.map((word, i) => {
            const c = COLORS[word.type];
            return (
              <div key={i} style={{ backgroundColor: '#fff', borderRadius: 8, padding: '10px 16px', display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: c.text }}>{word.swedish}</span>
                <span style={{ color: '#8888a0', fontSize: 13 }}>{word.meaning}</span>
              </div>
            );
          })}
        </div>

        <p style={{ color: '#7c6a9c', fontFamily: 'Georgia, serif', fontSize: 20, fontStyle: 'italic' }}>Gång på gång, sjung Carolus sång</p>
      </div>
      <Dots current={9} total={10} />
      <div style={{ position: 'fixed', bottom: 32, left: 32, right: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 50 }}>
        <div>{onBack && <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8888a0', fontSize: 14, letterSpacing: '0.05em' }}>← Back</button>}</div>
        <div><button onClick={onRestart} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1a1a2e', fontSize: 14, letterSpacing: '0.05em' }}>Start again →</button></div>
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
    <StorySlide1 key={1} onNext={next} onBack={back} />,
    <StorySlide2 key={2} onNext={next} onBack={back} />,
    <StorySlide3 key={3} onNext={next} onBack={back} />,
    <VocabPage key={4} onNext={next} onBack={back} />,
    <LyricsPage1 key={5} onNext={next} onBack={back} />,
    <LyricsPage2 key={6} onNext={next} onBack={back} />,
    <QuizPage key={7} onNext={next} onBack={back} />,
    <AnswersPage key={8} onNext={next} onBack={back} />,
    <EndSlide key={9} onRestart={restart} onBack={back} />,
  ];

  return <div>{slides[slide]}</div>;
}