import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogActions, DialogContent, DialogTitle, Slide,  } from '@mui/material';

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
            <DialogContent style={{ maxHeight: '70vh' }}> 

                <h4 className='regular black'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga ab eligendi ducimus consectetur expedita, provident laborum nulla nihil dolorem voluptate at porro ipsum error odit sit alias nam eveniet quisquam?
                </h4>
                
            </DialogContent>
            <DialogActions>
                <button className='button-white' onClick={() => navigate('/')} >
                    Cancelar
                </button>
                <button className='button-purple'  onClick={handleOpen} >
                    Aceitar
                </button>
            </DialogActions>
        </Dialog>
    );
};

export default TermsAcceptanceDialog;