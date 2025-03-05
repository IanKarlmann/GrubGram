import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';

const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'home',
    title: 'Home',
    icon: <DashboardIcon />,
  },
  {
    segment: 'account',
    title: 'Account',
    icon: <PersonIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Analytics',
  },
  {
    segment: 'tracking',
    title: 'Tracking',
    icon: <BarChartIcon />,
    children: [
      {
        segment: 'macro tracking',
        title: 'Macro Tracking',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'calorie tracking',
        title: 'Calorie Tracking',
        icon: <DescriptionIcon />,
      },
    ],
  }
];

// const demoTheme = createTheme({
//   cssVariables: {
//     colorSchemeSelector: 'data-toolpad-color-scheme',
//   },
//   colorSchemes: { light: true, dark: false },
//   breakpoints: {
//     values: {
//       xs: 0,
//       sm: 600,
//       md: 600,
//       lg: 1200,
//       xl: 1536,
//     },
//   },
// });

// demo page
function DemoPageContent({ pathname }) {
  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Typography>Content for {pathname}</Typography>
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function DashboardLayoutBasic(props) {
  const { window } = props;
  const router = useDemoRouter('/dashboard');
  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <Box 
      sx={{
        width: 250,
        position: 'sticky',
        left: 0,
        top: '0px', // Matches topbar height
        bottom: 0, // Extend to bottom of viewport
        zIndex: 1000,
        overflow: 'hidden', // Prevent internal scrolling
      }}
    >
      <AppProvider
        navigation={NAVIGATION}
        branding={{
          logo: <img 
            src={process.env.PUBLIC_URL + '/grub_logo.jpg'} 
            alt="Logo"
            style={{
              width: '50px', 
              height: 'auto',
              margin: '10px 0 20px 0', // Add some vertical spacing
              alignSelf: 'center',
              display: 'block'
            }}
          />,
          title: '',
          homeUrl: '/home',
        }}
        router={router}
        theme={createTheme({
          cssVariables: { colorSchemeSelector: 'data-toolpad-color-scheme' },
          colorSchemes: { light: true, dark: false },
        })}
        window={demoWindow}
      >
        <DashboardLayout 
          sx={{
            '& .MuiToolpad-dashboardLayoutHeader': {
              position: 'static', // Prevent fixed positioning
              top: 0,
              marginTop: 0,
              paddingTop: 0
            },
            '& .MuiToolpad-dashboardLayoutNavigation': {
              paddingTop: '20px', // Add padding to navigation items
              gap: '10px' // Add some spacing between navigation items
            }
          }}
        >
          {/* Your existing navigation content */}
        </DashboardLayout>
      </AppProvider>
    </Box>
  );
}

export default DashboardLayoutBasic;