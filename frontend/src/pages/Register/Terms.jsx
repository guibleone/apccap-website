import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogActions, DialogContent, DialogTitle, Slide, } from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} timeout={500} />;
});


const TermsAcceptanceDialog = ({ open, handleOpen }) => {

    const navigate = useNavigate();

    return (
        <Dialog open={open} TransitionComponent={Transition} onClose={() => {
            navigate('/');
            handleOpen();
        }}>
            <DialogTitle>Termos e Condições</DialogTitle>
            <DialogContent style={{ maxHeight: '70vh', textAlign:'justify' }}>


                <p>
                    A Lei Geral de Proteção de Dados - LGPD - <span><a href='https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm'> Lei n. 13709/2018</a></span> garante que toda pessoa natural tem assegurada a titularidade de seus dados pessoais e garantidos os direitos fundamentais de liberdade, de intimidade e de privacidade, nos termos desta Lei. O titular dos dados pessoais tem direito a obter do controlador, em relação aos dados do titular por ele tratados, a qualquer momento e mediante requisição da confirmação, acesso, correção, anonimização, portabilidade, eliminação, informações de seus dados pessoais.
                </p>

                <br />

                <p>
                    Para a Associação de Produtores de Cachaça de Alambique do Circuito das Águas Paulista (APCCAP) é muito importante que você saiba como tratamos os seus dados pessoais. Por esse motivo, gostaríamos de ter o seu consentimento para armazenarmos e utilizarmos, com toda a segurança e privacidade, seus dados pessoais e empresariais para que possamos:
                </p>

                <br />

         
                    <ul style={{
                        paddingLeft: '20px',
                    }}>
                        <li>
                            Informá-lo sobre os processos junto a APCCAP;
                        </li>
                        <li>

                            Comunicá-lo sobre as ações necessárias junto APCCAP;
                        </li>
                        <li>

                            Ouvi-lo a respeito das atividades desenvolvidas.
                        </li>
                    </ul>
              

            </DialogContent>
            <DialogActions>
                <button className='button-white' onClick={() => navigate('/')} >
                    Cancelar
                </button>
                <button className='button-purple' onClick={handleOpen} >
                    Aceitar
                </button>
            </DialogActions>
        </Dialog>
    );
};

export default TermsAcceptanceDialog;