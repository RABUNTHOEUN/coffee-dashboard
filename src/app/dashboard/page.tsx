import { AreaChartComponent } from '@/components/area-chart';
import { BarChartComponent } from '@/components/bar-chart';
import { PieChartComponent } from '@/components/pie-chart';
import { AreaChartInteractiveComponent } from '@/components/area-chart-interactive';
import RecentOrdersPage from './order/recent-order/page';


const Home = () => {

    return (
        <div suppressHydrationWarning>
            <h1 className="text-2xl font-bold text-start text-gray-900 dark:text-white mb-4 ml-4">
                Dashboard
            </h1>

            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="aspect-video rounded-xl bg-muted/50"><AreaChartComponent /></div>
                <div className="aspect-video rounded-xl bg-muted/50"><BarChartComponent /></div>
                <div className="aspect-video rounded-xl bg-muted/50"><PieChartComponent /></div>
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min my-4">
                <AreaChartInteractiveComponent />
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min my-4 pt-4">
                <RecentOrdersPage />
            </div>
        </div>
    );
};

export default Home;
