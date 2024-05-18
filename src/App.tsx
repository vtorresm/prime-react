import MenuBar from './components/menubar/Menubar';
import BasicDemo from './components/sidebar/Sidebar';
import ApplicationsDemo from './components/tasker/despliegue/Applications';

export default function App() {
  return (
    <div className='flex flex-row'>
      {/* <div className='flex'>
        <BasicDemo />
        <MenuBar />
      </div> */}

      <div>
        <ApplicationsDemo />{' '}
      </div>
    </div>
  );
}
