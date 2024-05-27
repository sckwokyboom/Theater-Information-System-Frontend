import {Box, Typography} from '@mui/material';
import theaterPhoto from '../../public/theater_photo.jpg';

export default function HomePageContent() {
    return (
        <Box p={2} textAlign="center">
            <Typography variant="h4" gutterBottom>
                Добро пожаловать в Большой театр
            </Typography>
            <img src={theaterPhoto} alt="Большой театр" style={{maxWidth: '100%', height: 'auto', margin: '20px 0'}}/>
            <Typography variant="body1">
                Большой театр — это один из самых известных театров мира, символ русской театральной культуры.
                Наш театр предлагает широкий репертуар спектаклей, опер и балетов. Узнайте больше о наших актёрах,
                авторах и постановках на этом сайте.
            </Typography>
        </Box>
    );
}
