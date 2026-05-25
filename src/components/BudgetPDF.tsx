import React from 'react';
import Image from 'next/image';

interface BudgetPDFProps {
  budget: any;
}

// Forward ref is used so that html2canvas can target this component easily
export const BudgetPDF = React.forwardRef<HTMLDivElement, BudgetPDFProps>(
  ({ budget }, ref) => {
    if (!budget) return null;

    const patientName = budget.patient?.firstName 
      ? `${budget.patient.firstName} ${budget.patient.paternalSurname || ''} ${budget.patient.maternalSurname || ''}`.trim()
      : budget.patient?.user?.name || 'Desconocido';

    return (
      <div 
        ref={ref} 
        style={{
          width: '794px', // A4 pixel width at 96 DPI
          height: '1123px', // A4 pixel height at 96 DPI
          backgroundColor: '#B5BAEF', // Background exact color
          padding: '40px',
          boxSizing: 'border-box',
          position: 'relative',
          fontFamily: 'sans-serif',
          color: '#071535'
        }}
        className="budget-pdf-container"
      >
        {/* Decorative Shapes Placeholder (Using CSS for approximation) */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '300px',
          height: '400px',
          backgroundColor: '#A0A7DF',
          borderRadius: '200px 0 0 200px',
          opacity: '0.6',
          zIndex: 0
        }} />

        <div style={{
          position: 'absolute',
          bottom: '150px',
          left: '-50px',
          width: '250px',
          height: '350px',
          backgroundColor: '#A0A7DF',
          borderRadius: '0 200px 200px 0',
          opacity: '0.6',
          zIndex: 0
        }} />

        {/* Content Container (Above Decorative Shapes) */}
        <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
          
          {/* Header Section */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '60px' }}>
            <div>
               {/* Note: In a real app we might use an Image, but text works well for PDF scale to keep it vector-like if possible. 
                   Alternatively, we could use an <img> tag with a base64 encoded src if the logo is a picture. */}
              <div style={{ fontSize: '70px', fontWeight: 'normal', lineHeight: '1', display: 'flex', alignItems: 'center', fontFamily: 'serif' }}>
                <span style={{ fontSize: '90px', marginRight: '5px' }}>D</span><span style={{ fontSize: '60px' }}>♡</span>
              </div>
              <div style={{ fontSize: '14px', letterSpacing: '2px', marginLeft: '5px', marginTop: '10px' }}>ODONTOLOGÍA</div>
            </div>
            <div style={{ fontSize: '32px', fontWeight: '900', marginTop: '20px', letterSpacing: '1px' }}>
              PRESUPUESTO
            </div>
          </div>

          {/* Patient Details */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '10px' }}>
              Nombre y apellido: {patientName}
            </h2>
            <p style={{ margin: '5px 0', fontSize: '16px' }}>
              Teléfono: {budget.patient?.user?.phone || budget.patient?.phoneCountryCode || ''} {budget.patient?.documentNumber || ''}
            </p>
            <p style={{ margin: '5px 0', fontSize: '16px' }}>
              Dirección: {budget.patient?.address || ''} {budget.patient?.country || ''}
            </p>
            <p style={{ margin: '5px 0', fontSize: '16px' }}>
              Correo electrónico: {budget.patient?.user?.email || ''}
            </p>
          </div>

          {/* Items Table */}
          <table 
            style={{ 
              width: '100%', 
              borderCollapse: 'collapse', 
              marginBottom: '20px',
              border: '2px solid #071535' 
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#071535', color: '#ffffff' }}>
                <th style={{ padding: '15px', textAlign: 'left', borderRight: '2px solid #ffffff', fontSize: '14px', letterSpacing: '1px', width: '40%' }}>DESCRIPCIÓN</th>
                <th style={{ padding: '15px', textAlign: 'center', borderRight: '2px solid #ffffff', fontSize: '14px', letterSpacing: '1px', width: '20%' }}>UNIDADES</th>
                <th style={{ padding: '15px', textAlign: 'center', borderRight: '2px solid #ffffff', fontSize: '14px', letterSpacing: '1px', width: '20%' }}>PRECIO<br/>UNITARIO</th>
                <th style={{ padding: '15px', textAlign: 'center', fontSize: '14px', letterSpacing: '1px', width: '20%' }}>PRECIO<br/>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {budget.items.map((item: any, index: number) => (
                <tr key={index}>
                  <td style={{ padding: '20px 15px', borderRight: '2px solid #071535', fontSize: '16px' }}>
                    {item.service?.name}
                  </td>
                  <td style={{ padding: '20px 15px', textAlign: 'center', borderRight: '2px solid #071535', fontSize: '16px' }}>
                    {item.quantity}
                  </td>
                  <td style={{ padding: '20px 15px', textAlign: 'center', borderRight: '2px solid #071535', fontSize: '16px' }}>
                    {Number(item.unitPrice).toFixed(0)}
                  </td>
                  <td style={{ padding: '20px 15px', textAlign: 'center', fontSize: '16px' }}>
                    s/ {Number(item.subtotal).toFixed(0)}
                  </td>
                </tr>
              ))}

              {/* Pad with empty rows to simulate the design's height */}
              <tr style={{ height: '250px' }}>
                <td style={{ borderRight: '2px solid #071535' }}>&nbsp;</td>
                <td style={{ borderRight: '2px solid #071535' }}>&nbsp;</td>
                <td style={{ borderRight: '2px solid #071535' }}>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
            </tbody>
          </table>

          {/* Total Section */}
          <div style={{ textAlign: 'right', fontSize: '24px', fontWeight: '800', marginBottom: 'auto' }}>
            Total: s/. {Number(budget.totalAmount).toFixed(0)}
          </div>

          {/* Footer */}
          <div style={{
            backgroundColor: '#071535',
            color: 'white',
            padding: '20px',
            borderRadius: '20px',
            textAlign: 'center',
            fontSize: '14px',
            lineHeight: '1.6',
            width: '100%',
            marginTop: 'auto'
          }}>
            Urb. Santa Rosa Mz L lt 30 - Los Olivos<br/>
            @dra.nash_<br/>
            "Cuidar tu sonrisa es cuidarte a ti mismo."
          </div>
        </div>
      </div>
    );
  }
);

BudgetPDF.displayName = 'BudgetPDF';
