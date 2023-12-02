import { Box, Typography } from "@mui/material";

export default function Event(currentEvent) {
    let description = currentEvent.description;
    let background = currentEvent.background;
    let name = currentEvent.name;
    return (
        <>
            <Box
                sx={{
                    flexDirection: 'column',
                    display: 'inline-flex',
                    alignItems: 'end',
                    height: '50vh',
                    width: '90vw',
                    backgroundImage: `url('../${background}')`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    padding: '10px',
                    justifyContent: 'flex-end'
                }}
            >
                <Typography variant="h5">{name}</Typography>
                <Typography>{description}</Typography>
            </Box>
        </>
    );
}