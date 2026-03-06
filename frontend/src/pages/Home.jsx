export default function Home() {
  return (
    <div style={{ background: '#0D1B2A', minHeight: '100vh', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', background: 'linear-gradient(90deg, #007BFF, #8A2BE2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          JAV LABS
        </h1>
        <p style={{ color: '#ccc', fontSize: '1.2rem' }}>Agencia de Automatización</p>
        <a href="/contacto" style={{ display: 'inline-block', marginTop: '2rem', padding: '12px 32px', background: 'linear-gradient(90deg, #007BFF, #8A2BE2)', borderRadius: '6px', color: '#fff', textDecoration: 'none' }}>
          Ver Servicios
        </a>
      </div>
    </div>
  );
}
