// src/components/PDFReunion.js
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { colors } from '../../../colors';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'colomn',
    backgroundColor: '#ffffff',
  },
  assocaicao: {
    fontSize: 12,

  },
  title: {
    fontSize: 24,
    textAlign: 'center',
  },
});

const PDFReunion = ({ title, message, pautas, type, date, dateConvocacao }) => (
  <Document>
    <Page size="A4" style={styles.page}>

      <View style={{
        padding: '50px 20px 20px 20px',
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',

      }}>

        <Image src={require('../../../../imgs/logo-apccap.png')} style={{
          width: 100,
        }} />

        <View style={{
          textAlign: 'right',
          color: colors.main_black,
          maxWidth: '45%',
          border: '2px solid #000000',
          padding: '25px 5px 5px 5px',
          maxHeight: '100px',
          alignItems: 'center',
        }}>

          <Text style={{
            fontSize: '10px',
            fontWeight: 'bold',
          }}>Associção de Produtores de Cachaça de Alambique do Circuito das Águas Paulistas</Text>

          <Text style={{
            fontSize: '8px',
          }}>Rua Dr. Cândido Rodrigues, 51 - Centro, Águas de Lindóia - SP <br /> CEP: 13940-000 <br />
            email: apccap@gamil.com
          </Text>

        </View>

      </View>

      <View style={{
        margin: '25px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '25px',
        alignItems: 'center',
      }}>
        <Text style={{
          fontSize: '14px',
          fontWeight: 'bold',
        }}>

          ADMINISTRAÇÃO DA APCCAP

        </Text>

        <Text style={{
          fontSize: '14px',
          fontWeight: 'light'
        }}>

          CONVOCAÇÃO Nº {title}

        </Text>

      </View>

      <View style={{
        padding: '0px 20px 20px 20px',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <Text style={{
          fontSize: '12px',
        }}>
          A administração da APCCAP, no uso de suas atribuições, convoca os membros associadas para uma reunião 
          {type === 'assembleia_ordinal' ? ' assembléia ordinal ' : ' assembléia extraordinária '}     
          de acordo com o estatuto da associação.
        </Text>

        <Text style={{
          fontSize: '12px',
          fontWeight: 'bold',
        }}>
          - {date} , com previsão de 1 hora de duração.
        </Text>

        <Text style={{
          fontSize: '12px',
        }}>
          {message}
        </Text>

        <Text style={{
          fontSize: '12px',
        }}>
          Pautas:
        </Text>

        {pautas.map((pauta, index) => (
          <Text key={index} style={{
            fontSize: '12px',
          }}>
            {index + 1}. {pauta.title};
          </Text>
        ))}

        <Text style={{
          fontSize: '12px',
          textAlign: 'right',
          marginTop: '15px'
        }}>
          Amparo, {dateConvocacao}.

        </Text>

      </View>

    </Page>
  </Document>
);

export default PDFReunion;
