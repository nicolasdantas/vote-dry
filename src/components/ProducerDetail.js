import React, { useEffect, useState } from 'react';
import Rating from '@material-ui/lab/Rating';
import axios from 'axios';
import Footer from '../components/Footer';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import '../styles/ProducerDetail.scss';

const ProducerDetail = (props) => {
  const [producerDetail, setProducerDetail] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const producerId = props.match.params.producer;

  useEffect(() => {
    axios.get(`http://192.168.68.111:5000/producerList`).then((response) => {
      setProducerDetail(
        response.data.filter((producer) => producer.id === parseInt(producerId))
      );
    });
  }, [producerId]);

  const handleClick = () => {
    const finalQuantity = producerDetail[0].stock - quantity;
    axios
      .post(
        `http://192.168.68.111:5000/producer?id=${producerId}&&stock=${finalQuantity}`
      )
      .then((res) => console.log(res))
      .then(props.history.push(`/consumer/orderconfirmed/${producerId}`))
      .catch((err) => console.log(err));
  };

  console.log(producerDetail);

  return (
    producerDetail.length !== 0 && (
      <div className='producer-detail-container'>
        <section className='producer-detail'>
          <h1>
            {producerDetail[0].name} from {producerDetail[0].city}
          </h1>
          <h3>
            Alcohol available : {producerDetail[0].stock}{' '}
            {producerDetail[0].alcohol}
          </h3>
          <div className='rating'>
            <Box component='fieldset' mb={3} borderColor='transparent'>
              <Typography component='legend'>Rating :</Typography>
              <Rating
                name='read-only'
                value={producerDetail[0].ratings}
                readOnly
                max={10}
              />
            </Box>
          </div>
          <div className='input'>
            <TextField
              id='standard-number'
              label='Number'
              type='number'
              value={quantity}
              InputProps={{
                inputProps: { min: 0, max: producerDetail[0].stock },
              }}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(event) => setQuantity(event.target.value)}
            />
          </div>
          <div className='button'>
            <Button variant='contained' type='button' onClick={handleClick}>
              Send my order
            </Button>
          </div>
        </section>
        <footer>
          <Footer />
        </footer>
      </ div>
    )
  );
};

export default ProducerDetail;
