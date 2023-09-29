
const matches = window.matchMedia('(min-width:600px)').matches;

const styleForm = matches ? {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    border: '2px solid #140C9F',
    boxShadow: 24,
    backgroundColor: 'white',

} : {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    border: '2px solid #140C9F',
    backgroundColor: 'white',
    boxShadow: 24,
    p: 4,

}

export { styleForm }

