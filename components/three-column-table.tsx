'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function ThreeColumnTable() {
  const tabsData = {
    tab1: {
      title: 'Tab 1',
      buttonText: 'Learn More',
      data: [
        { id: 1, label: 'Feature A', col2: 'Description A1', col3: 'Value A1' },
        { id: 2, label: 'Feature B', col2: 'Description A2', col3: 'Value A2' },
        { id: 3, label: 'Feature C', col2: 'Description A3', col3: 'Value A3' },
        { id: 4, label: 'Feature D', col2: 'Description A4', col3: 'Value A4' },
        { id: 5, label: 'Feature E', col2: 'Description A5', col3: 'Value A5' },
        { id: 6, label: 'Feature F', col2: 'Description A6', col3: 'Value A6' },
        { id: 7, label: 'Feature G', col2: 'Description A7', col3: 'Value A7' },
        { id: 8, label: 'Feature H', col2: 'Description A8', col3: 'Value A8' },
        { id: 9, label: 'Feature I', col2: 'Description A9', col3: 'Value A9' },
        {
          id: 10,
          label: 'Feature J',
          col2: 'Description A10',
          col3: 'Value A10',
        },
        {
          id: 11,
          label: 'Feature K',
          col2: 'Description A11',
          col3: 'Value A11',
        },
        {
          id: 12,
          label: 'Feature L',
          col2: 'Description A12',
          col3: 'Value A12',
        },
      ],
    },
    tab2: {
      title: 'Tab 2',
      buttonText: 'Learn More',
      data: [
        { id: 1, label: 'Option X', col2: 'Description B1', col3: 'Value B1' },
        { id: 2, label: 'Option Y', col2: 'Description B2', col3: 'Value B2' },
        { id: 3, label: 'Option Z', col2: 'Description B3', col3: 'Value B3' },
        { id: 4, label: 'Option W', col2: 'Description B4', col3: 'Value B4' },
        { id: 5, label: 'Option V', col2: 'Description B5', col3: 'Value B5' },
        { id: 6, label: 'Option U', col2: 'Description B6', col3: 'Value B6' },
        { id: 7, label: 'Option T', col2: 'Description B7', col3: 'Value B7' },
        { id: 8, label: 'Option S', col2: 'Description B8', col3: 'Value B8' },
        { id: 9, label: 'Option R', col2: 'Description B9', col3: 'Value B9' },
        {
          id: 10,
          label: 'Option Q',
          col2: 'Description B10',
          col3: 'Value B10',
        },
        {
          id: 11,
          label: 'Option P',
          col2: 'Description B11',
          col3: 'Value B11',
        },
        {
          id: 12,
          label: 'Option O',
          col2: 'Description B12',
          col3: 'Value B12',
        },
      ],
    },
  };

  const renderTable = (
    tableData: typeof tabsData.tab1.data,
    buttonText: string,
    isMobile = false
  ) => {
    return (
      <div className="bg-[#ffffff] overflow-hidden">
        {/* Table Header */}
        <div
          className={`grid grid-cols-3 gap-4 pb-4 ${
            isMobile
              ? 'bg-[#ffffff] border-b'
              : 'bg-[#e0e0e0] border-b border-[#d9d9d9]'
          } border-[#e0e0e0]`}
        >
          {/* Empty space for label column */}
          <div></div>
          {/* Header for column 2 */}
          <div className="font-semibold text-[#141414] text-sm">Label</div>
          {/* Header for column 3 */}
          <div className="font-semibold text-[#141414] text-sm">Label</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-[#e0e0e0]">
          {tableData.map((row) => (
            <div
              key={row.id}
              className={`grid grid-cols-3 gap-4 py-4 ${
                !isMobile ? 'hover:bg-[#e7e7e7] transition-colors' : ''
              }`}
            >
              <div className="font-semibold text-[#141414] text-sm">
                {row.label}
              </div>
              <div className="text-[#525252] text-sm">{row.col2}</div>
              <div className="text-[#525252] text-sm">{row.col3}</div>
            </div>
          ))}
        </div>

        {/* Bottom Buttons */}
        <div className="p-4 bg-[#ffffff] border-t border-[#e0e0e0]">
          <div className="grid grid-cols-3 gap-4">
            {/* Empty space for label column */}
            <div></div>
            {/* Button for column 2 */}
            <div className="flex justify-center">
              <button className="px-4 py-3 bg-[#0000c9] text-white text-sm font-medium rounded-full hover:bg-[#0000a0] transition-colors">
                {buttonText}
              </button>
            </div>
            {/* Button for column 3 */}
            <div className="flex">
              <button className="px-4 py-3 bg-[#0000c9] text-white text-sm font-medium rounded-full hover:bg-[#0000a0] transition-colors">
                {buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="px-4 py-10">
      <div className="">
        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Mobile Header */}
          <div className="space-y-6 mb-8">
            <h3>Headline Goes Here</h3>
            <Tabs defaultValue="tab1" className="w-full">
              <TabsList className="flex bg-transparent gap-3 p-0 h-auto">
                <TabsTrigger
                  value="tab1"
                  className="inline-flex items-center px-4 py-2 w-max rounded-full text-sm font-medium bg-[#fff] text-[#0000c9] border border-[#E7E7E7] data-[state=active]:bg-[#D1E3FB] data-[state=active]:border-[#D1E3FB]"
                >
                  {tabsData.tab1.title}
                </TabsTrigger>
                <TabsTrigger
                  value="tab2"
                  className="inline-flex items-center px-4 py-2 w-max rounded-full text-sm font-medium bg-[#fff] text-[#0000c9] border border-[#E7E7E7] data-[state=active]:bg-[#D1E3FB] data-[state=active]:border-[#D1E3FB]"
                >
                  {tabsData.tab2.title}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="tab1" className="mt-6">
                {renderTable(
                  tabsData.tab1.data,
                  tabsData.tab1.buttonText,
                  true
                )}
              </TabsContent>
              <TabsContent value="tab2" className="mt-6">
                {renderTable(
                  tabsData.tab2.data,
                  tabsData.tab2.buttonText,
                  true
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Heading and Tabs */}
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-[#141414] leading-tight">
                Lorem ipsum headline
              </h1>
              <Tabs defaultValue="tab1" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-transparent gap-3 p-0 h-auto">
                  <TabsTrigger
                    value="tab1"
                    className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-[#d1e3fb] text-[#0000c9] data-[state=active]:bg-[#0000c9] data-[state=active]:text-white"
                  >
                    {tabsData.tab1.title}
                  </TabsTrigger>
                  <TabsTrigger
                    value="tab2"
                    className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-[#d1e3fb] text-[#0000c9] data-[state=active]:bg-[#0000c9] data-[state=active]:text-white"
                  >
                    {tabsData.tab2.title}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="tab1" className="mt-6">
                  {renderTable(
                    tabsData.tab1.data,
                    tabsData.tab1.buttonText,
                    false
                  )}
                </TabsContent>
                <TabsContent value="tab2" className="mt-6">
                  {renderTable(
                    tabsData.tab2.data,
                    tabsData.tab2.buttonText,
                    false
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Empty for desktop since table moved to tabs */}
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
