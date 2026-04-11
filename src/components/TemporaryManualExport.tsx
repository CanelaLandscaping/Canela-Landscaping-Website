import { FileDown } from 'lucide-react';

const TemporaryManualExport = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Utility Bar - Only visible on screen */}
      <div className="print:hidden bg-emerald-900 text-white p-4 flex items-center justify-between sticky top-0 z-[100] shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-black">C</div>
          <span className="font-bold tracking-tight">UTILIDAD: Exportar Manual del Propietario</span>
        </div>
        <button 
          onClick={handlePrint}
          className="bg-white text-emerald-900 px-6 py-2 rounded-full font-black flex items-center gap-2 hover:bg-emerald-50 transition-all active:scale-95"
        >
          <FileDown size={18} />
          Descargar Manual (PDF)
        </button>
      </div>

      {/* Printable Content - Only visible when printing */}
      <div className="hidden print:block p-12 bg-white text-slate-900 font-sans max-w-4xl mx-auto print-manual-container">
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            /* Fix: Hide all other content without reserving space */
            @page {
              size: auto;
              margin: 10mm;
            }
            body { 
              background: white !important;
              padding: 0 !important;
              margin: 0 !important;
            }
            /* Use a very aggressive visibility hide */
            body * {
              visibility: hidden !important;
              height: 0 !important;
              overflow: hidden !important;
              padding: 0 !important;
              margin: 0 !important;
              border: none !important;
            }
            /* Specifically show the manual and its children */
            .print-manual-container, 
            .print-manual-container * {
              visibility: visible !important;
              height: auto !important;
              overflow: visible !important;
              position: relative !important;
            }
            .print-manual-container {
              display: block !important;
              position: absolute !important;
              top: 0 !important;
              left: 0 !important;
              width: 100% !important;
              padding: 2cm !important;
              margin: 0 !important;
              background: white !important;
            }
            h1 { font-size: 32pt; font-weight: 900; margin-bottom: 20pt; color: #064e3b; border-bottom: 2pt solid #10b981; padding-bottom: 10pt; display: block !important; }
            h2 { font-size: 24pt; font-weight: 800; margin-top: 30pt; margin-bottom: 15pt; color: #065f46; display: block !important; }
            h3 { font-size: 18pt; font-weight: 700; margin-top: 20pt; margin-bottom: 10pt; color: #047857; display: block !important; }
            p { font-size: 12pt; line-height: 1.6; margin-bottom: 10pt; color: #334155; display: block !important; }
            ul, ol { margin-bottom: 15pt; padding-left: 20pt; display: block !important; }
            li { font-size: 12pt; margin-bottom: 5pt; display: list-item !important; }
            .page-break { 
              page-break-after: always !important; 
              height: 0 !important; 
              display: block !important;
              visibility: hidden !important;
            }
          }
        `}} />

        <div className="print-manual">
          <div className="text-center mb-16">
            <h1 className="border-none text-6xl uppercase tracking-tighter">Canela Landscaping</h1>
            <p className="text-xl font-bold text-emerald-600">Manual Oficial del Propietario (Alojamiento sin Costo)</p>
          </div>

          <section>
            <hr className="my-8 opacity-20" />

            <h2>🛠️ Fase 1: Configuración de GitHub (Su Código)</h2>
            <p>GitHub es donde se almacenan los "planos" (el código) de su sitio web. Al crear una cuenta personal, usted es el dueño del código mientras permite que su desarrollador trabaje en él de forma gratuita.</p>
            <ol>
              <li><strong>Crear una Cuenta:</strong> Regístrese para obtener una cuenta personal gratuita en github.com.</li>
              <li><strong>Crear un Repositorio Privado:</strong> Haga clic en el botón + (New). Nómbrelo "CanelaLandscaping". Asegúrese de seleccionar Private.</li>
              <li><strong>Invitar a su Desarrollador:</strong> Vaya a la pestaña Settings de su nuevo repositorio, haga clic en Collaborators a la izquierda e invite a @leoalfonso14 (o leandroalfonso14@gmail.com).</li>
            </ol>

            <div className="page-break" />

            <h2>🛠️ Fase 2: Configuración de Supabase (Su Base de Datos)</h2>
            <p>Supabase almacena los mensajes de "Contacto" de sus clientes. Esto asegura que nunca pierda un cliente potencial.</p>
            <ol>
              <li><strong>Crear una Cuenta:</strong> Regístrese en supabase.com.</li>
              <li><strong>Crear un Proyecto:</strong> Haga clic en + New Project. Nómbrelo "Canela Landscaping".</li>
              <li><strong>Establecer una Contraseña:</strong> ¡Elija una contraseña de base de datos segura y guárdela bien!</li>
              <li><strong>Invitar a su Desarrollador:</strong> Vaya a Settings &gt; Team e invite a leandroalfonso14@gmail.com como Owner (Propietario).</li>
            </ol>

            <div className="page-break" />

            <h2>🛠️ Fase 3: Configuración de Vercel (Su Alojamiento Gratuito)</h2>
            <p>Vercel es el "hogar" de su sitio web. El <strong>Plan Hobby es 100% gratuito</strong> y le permite usar su propio nombre de dominio (por ejemplo, canelalandscaping.com) sin costo adicional.</p>
            <ol>
              <li><strong>Crear una Cuenta:</strong> Regístrese en vercel.com usando su cuenta de GitHub.</li>
              <li><strong>Importar Proyecto:</strong> Seleccione Add New Project y elija el repositorio "Canela Landscaping" que acaba de crear.</li>
              <li><strong>Añadir su Dominio:</strong> Una vez desplegado, vaya a Settings &gt; Domains en Vercel para conectar su dirección comercial oficial. Añadir un dominio en el plan Hobby es Gratis.</li>
            </ol>

            <div className="page-break" />

            <h2>🛠️ Fase 4: Configuración de Resend (Sus Correos Electrónicos)</h2>
            <p>Resend permite que el sitio web le envíe una notificación por correo electrónico cada vez que un cliente complete su formulario de contacto.</p>
            <ol>
              <li><strong>Crear una Cuenta:</strong> Regístrese en resend.com.</li>
              <li><strong>Clave API:</strong> Vaya a la pestaña API Keys a la izquierda.</li>
              <li><strong>Generar Clave:</strong> Haga clic en + Create API Key. Nómbrela "Website Notifications".</li>
              <li><strong>Enviar al Desarrollador:</strong> Copie la clave (comienza con re_) y envíela de forma segura a su desarrollador.</li>
            </ol>
          </section>

          <footer className="mt-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
            © {new Date().getFullYear()} Canela Landscaping & Snow Plow - Documentación Oficial de Entrega
          </footer>
        </div>
      </div>
    </>
  );
};

export default TemporaryManualExport;
