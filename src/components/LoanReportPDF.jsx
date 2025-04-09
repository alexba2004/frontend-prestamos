import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Definición de estilos mejorados
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#f0f2f5',
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#2c3e50',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  section: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  label: {
    fontWeight: 'bold',
    width: '30%',
    fontSize: 14,
    color: '#34495e',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    width: '70%',
    fontSize: 14,
    color: '#2c3e50',
  },
  statusActive: {
    backgroundColor: '#27ae60',
    color: '#fff',
    padding: 6,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  statusReturned: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    padding: 6,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  divider: {
    borderBottom: '1px solid #e0e0e0',
    marginVertical: 15,
  },
  footer: {
    fontSize: 12,
    textAlign: 'center',
    color: '#7f8c8d',
    marginTop: 30,
    fontStyle: 'italic',
  },
});

const LoanReportPDF = ({ loans }) => {
  const loansPerPage = 3;
  const totalPages = Math.ceil(loans.length / loansPerPage);

  return (
    <Document>
      {Array.from({ length: totalPages }, (_, pageIndex) => (
        <Page
          key={pageIndex}
          style={styles.page}
        >
          <Text style={styles.title}>Reporte de Préstamos</Text>
          {loans
            .slice(pageIndex * loansPerPage, (pageIndex + 1) * loansPerPage)
            .map((loan) => (
              <View
                key={loan.loan_id}
                style={styles.section}
              >
                <Text style={styles.row}>
                  <Text style={styles.label}>ID:</Text>
                  <Text style={styles.value}>{loan.loan_id}</Text>
                </Text>
                <Text style={styles.row}>
                  <Text style={styles.label}>Usuario:</Text>
                  <Text style={styles.value}>
                    {loan.user.first_name} {loan.user.last_name}
                  </Text>
                </Text>
                <Text style={styles.row}>
                  <Text style={styles.label}>Material:</Text>
                  <Text style={styles.value}>
                    {loan.material.material_type} - {loan.material.brand}{' '}
                    {loan.material.model}
                  </Text>
                </Text>
                <Text style={styles.row}>
                  <Text style={styles.label}>Fecha de Préstamo:</Text>
                  <Text style={styles.value}>{loan.loan_date}</Text>
                </Text>
                <Text style={styles.row}>
                  <Text style={styles.label}>Fecha de Devolución:</Text>
                  <Text style={styles.value}>{loan.return_date}</Text>
                </Text>
                <Text style={styles.row}>
                  <Text style={styles.label}>Estado:</Text>
                  <Text
                    style={
                      loan.loan_status === 'Active'
                        ? styles.statusActive
                        : styles.statusReturned
                    }
                  >
                    {loan.loan_status}
                  </Text>
                </Text>
                <View style={styles.divider}></View>
              </View>
            ))}
          <Text style={styles.footer}>
            Reporte generado el {new Date().toLocaleDateString()} - Página {pageIndex + 1}{' '}
            de {totalPages}
          </Text>
        </Page>
      ))}
    </Document>
  );
};

export default LoanReportPDF;
