import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                backgroundColor: 'lightgray',
                color: 'black',
                bottom: 0,
                width: '100%',
            }}
        >
            <Container maxWidth="xl">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    <Box>
                        <Typography variant="h6" gutterBottom >
                            Koi Ordering From Japan Shop
                        </Typography>
                        <Typography variant="body2">
                            Address: 123 Le Loi, Ward 1, District 1
                        </Typography>
                        <Typography variant="body2">
                            Phone: 0912 645 555
                        </Typography>
                        <Typography variant="body2">
                            Email: koishopjp.contact@gmail.com
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: { xs: 2, md: 0 }}}>
                        <IconButton aria-label="facebook" href="https://www.facebook.com">
                            <FacebookIcon/>
                        </IconButton>
                        <IconButton aria-label="twitter" href="https://www.twitter.com">
                            <TwitterIcon/>
                        </IconButton>
                        <IconButton aria-label="instagram" href="https://www.instagram.com">
                            <InstagramIcon />
                        </IconButton>
                        <IconButton aria-label="linkedin" href="https://www.linkedin.com">
                            <LinkedInIcon />
                        </IconButton>
                    </Box>
                </Box>
                <Box mt={3}>
                    <Typography variant="body2" color="text.secondary" align="center">
                        {'© '}
                        <Link color="inherit" href="https://ace.com/">
                            Koi JP
                        </Link>{' '}
                        {new Date().getFullYear()}
                        {'. All rights reserved.'}
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}

export default Footer;
