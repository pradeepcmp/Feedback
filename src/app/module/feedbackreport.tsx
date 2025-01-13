"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from 'next/image'
import logo from '../../../public/SPACE LOGO 3D 03.png'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, FileSpreadsheet, RefreshCcw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { FeedbackData, TimelineDataPoint, AdvancedMetrics } from '@/app/types/feedbackreport';
import { dateRangeOptions,getDateRange,calculateMetrics,calculateChartData,calculateTimelineData,exportToCSV } from '@/app/module/utils/feedbackUtils';

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
  
  const FeedbackReport = () => {
    const [feedbackData, setFeedbackData] = useState<FeedbackData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState<FeedbackData[]>([]);
    const [selectedBranch, setSelectedBranch] = useState('all');
    const [selectedDateRange, setSelectedDateRange] = useState('all');
    const [uniqueBranches, setUniqueBranches] = useState<string[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);
    const [timelineData, setTimelineData] = useState<TimelineDataPoint[]>([]);
    const [metrics, setMetrics] = useState<AdvancedMetrics | null>(null);
  
    // Fetch data on component mount
    useEffect(() => {
      fetchFeedbackData();
    }, []);
  
    // Update branches and recalculate data when feedback data changes
    useEffect(() => {
      if (feedbackData.length > 0) {
        const branches = Array.from(new Set(feedbackData.map(item => item.branch))).sort();
        setUniqueBranches(branches);
        const newChartData = calculateChartData(feedbackData, branches);
        const newTimelineData = calculateTimelineData(feedbackData);
        setChartData(newChartData);
        setTimelineData(newTimelineData);
      }
    }, [feedbackData]);
  
    // Filter data when search criteria change
    useEffect(() => {
      filterData();
    }, [searchTerm, selectedBranch, selectedDateRange, feedbackData]);
  
    const filterData = () => {
      let filtered = [...feedbackData];
  
      if (selectedBranch !== 'all') {
        filtered = filtered.filter(feedback => feedback.branch === selectedBranch);
      }
  
      if (selectedDateRange !== 'all') {
        const rangeDate = getDateRange(selectedDateRange);
        filtered = filtered.filter(feedback => 
          new Date(feedback.createdAt) >= rangeDate
        );
      }
  
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filtered = filtered.filter(feedback => {
          const mobileNo = feedback.mobileNo?.toLowerCase() || '';
          const branch = feedback.branch?.toLowerCase() || '';
          const comments = feedback.additionalComments?.toLowerCase() || '';
          
          return mobileNo.includes(searchLower) ||
                 branch.includes(searchLower) ||
                 comments.includes(searchLower);
        });
      }
  
      setFilteredData(filtered);
      const newMetrics = calculateMetrics(filtered, uniqueBranches);
      setMetrics(newMetrics);
    };
  
    const resetFilters = () => {
      setSearchTerm('');
      setSelectedBranch('all');
      setSelectedDateRange('all');
    };
  
    const fetchFeedbackData = async () => {
      try {
        setLoading(true);
        setError(null);
        resetFilters();
        
        const response = await axios.get<{ data: FeedbackData[] }>('https://cust.spacetextiles.net/feedback_report');
        const sortedData = response.data.data.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setFeedbackData(sortedData);
        setFilteredData(sortedData);
      } catch (error) {
        setError('Error fetching feedback data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
  
    const handleExportCSV = () => {
      exportToCSV(filteredData);
    };
  
    if (loading) {
      return (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-800"></div>
        </div>
      );
    }
  
    if (error) {
      return (
        <Card className="w-full">
          <CardContent className="p-6">
            <div className="text-center text-red-600">{error}</div>
          </CardContent>
        </Card>
      );
    }

    return (
        <div className="space-y-6">
        <div className="flex justify-center items-center w-full h-full mb-3">
        <Image src={logo} alt="space" width={500} height={500} priority className="drop-shadow-xl" />
      </div>
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-800">Feedback Report</h1>
            <div className="flex gap-4">
              <Button 
                onClick={handleExportCSV}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Export CSV
              </Button>
              <Button 
                onClick={fetchFeedbackData}
                className="flex items-center gap-2"
              >
                <RefreshCcw className="w-4 h-4" />
                Refresh Data
              </Button>
            </div>
          </div>

      {/* Filters Section */}
      <Card className="bg-gray-50">
        <CardContent className="p-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <Input
                type="search"
                placeholder="Search by mobile, branch, or comments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white"
              />
            </div>
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="w-[200px] bg-white">
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                {uniqueBranches.map((branch) => (
                  <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
              <SelectTrigger className="w-[200px] bg-white">
                <SelectValue placeholder="Select Date Range" />
              </SelectTrigger>
              <SelectContent>
                {dateRangeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      {metrics && (
        <div className="grid grid-cols-5 gap-4">
          <Card className="bg-blue-50">
            <CardContent className="p-6">
              <div className="text-sm font-medium text-blue-800">Overall Experience</div>
              <div className="text-3xl font-bold text-blue-900">{metrics.averageRatings.overall}</div>
              <div className="mt-2 text-sm text-blue-600">
                Based on {metrics.totalResponses} responses
              </div>
            </CardContent>
          </Card>
          <Card className="bg-green-50">
            <CardContent className="p-6">
              <div className="text-sm font-medium text-green-800">Customer Service</div>
              <div className="text-3xl font-bold text-green-900">{metrics.averageRatings.service}</div>
              <div className="mt-2 text-sm text-green-600">
                {((metrics.averageRatings.service / 5) *100).toFixed(1)}% satisfaction
              </div>
            </CardContent>
          </Card>
          <Card className="bg-purple-50">
            <CardContent className="p-6">
              <div className="text-sm font-medium text-purple-800">Staff Behavior</div>
              <div className="text-3xl font-bold text-purple-900">{metrics.averageRatings.staff}</div>
              <div className="mt-2 text-sm text-purple-600">
                {((metrics.averageRatings.staff / 5) * 100).toFixed(1)}% satisfaction
              </div>
            </CardContent>
          </Card>
          <Card className="bg-orange-50">
            <CardContent className="p-6">
              <div className="text-sm font-medium text-orange-800">Jewelry Collection</div>
              <div className="text-3xl font-bold text-orange-900">{metrics.averageRatings.collection}</div>
              <div className="mt-2 text-sm text-orange-600">
                {((metrics.averageRatings.collection / 5) * 100).toFixed(1)}% satisfaction
              </div>
            </CardContent>
          </Card>
          <Card className="bg-teal-50">
            <CardContent className="p-6">
              <div className="text-sm font-medium text-teal-800">Would Recommend</div>
              <div className="text-3xl font-bold text-teal-900">{metrics.recommendationRate}%</div>
              <div className="mt-2 text-sm text-teal-600">
                of customers would recommend
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Rating Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="branch" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="overallExperience" stroke="#1e40af" name="Overall Experience" />
                <Line type="monotone" dataKey="customerService" stroke="#15803d" name="Customer Service" />
                <Line type="monotone" dataKey="staffBehavior" stroke="#7e22ce" name="Staff Behavior" />
                <Line type="monotone" dataKey="jewelryCollection" stroke="#c2410c" name="Jewelry Collection" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response Timeline</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" orientation="left" stroke="#1e40af" />
                <YAxis yAxisId="right" orientation="right" stroke="#15803d" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="count" fill="#1e40af" name="Response Count" />
                <Bar yAxisId="right" dataKey="averageRating" fill="#15803d" name="Avg Rating" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Discovery Methods Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Discovery Methods Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(
              filteredData.reduce((acc: { [key: string]: number }, curr) => {
                curr.discoveryMethods.forEach(method => {
                  acc[method] = (acc[method] || 0) + 1;
                });
                return acc;
              }, {})
            ).map(([method, count]) => (
              <Card key={method} className="bg-gray-50">
                <CardContent className="p-4">
                  <div className="text-sm font-medium">{method}</div>
                  <div className="text-2xl font-bold">
                    {count} ({((count / filteredData.length) * 100).toFixed(1)}%)
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Branch Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Branch Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(
              filteredData.reduce((acc: { [key: string]: any }, curr) => {
                if (!acc[curr.branch]) {
                  acc[curr.branch] = {
                    count: 0,
                    overallExperience: 0,
                    recommendCount: 0
                  };
                }
                acc[curr.branch].count++;
                acc[curr.branch].overallExperience += curr.overallExperience;
                acc[curr.branch].recommendCount += curr.wouldRecommend === 'yes' ? 1 : 0;
                return acc;
              }, {})
            ).map(([branch, data]) => (
              <Card key={branch} className="bg-gradient-to-br from-blue-50 to-white">
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold text-blue-800">{branch}</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Feedback:</span>
                      <span className="font-medium">{data.count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Avg Rating:</span>
                      <span className="font-medium">
                        {(data.overallExperience / data.count).toFixed(1)}/5
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Would Recommend:</span>
                      <span className="font-medium">
                        {((data.recommendCount / data.count) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Feedback Table */}
      <Card>
        <CardContent className="p-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-bold">Date</TableHead>
                  <TableHead className="font-bold">Mobile</TableHead>
                  <TableHead className="font-bold">Branch</TableHead>
                  <TableHead className="font-bold">Overall</TableHead>
                  <TableHead className="font-bold">Service</TableHead>
                  <TableHead className="font-bold">Staff</TableHead>
                  <TableHead className="font-bold">Collection</TableHead>
                  <TableHead className="font-bold">Recommend</TableHead>
                  <TableHead className="font-bold">Discovery</TableHead>
                  <TableHead className="font-bold">Comments</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((feedback) => (
                  <TableRow key={feedback.id} className="hover:bg-gray-50">
                    <TableCell>{new Date(feedback.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{feedback.mobileNo}</TableCell>
                    <TableCell>{feedback.branch}</TableCell>
                    <TableCell><StarRating rating={feedback.overallExperience} /></TableCell>
                    <TableCell><StarRating rating={feedback.customerService} /></TableCell>
                    <TableCell><StarRating rating={feedback.staffBehavior} /></TableCell>
                    <TableCell><StarRating rating={feedback.jewelryCollection} /></TableCell>
                    <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${feedback.wouldRecommend === 'yes'? 'bg-green-100 text-green-800': feedback.wouldRecommend === 'no'
                    ? 'bg-red-100 text-red-800': 'bg-gray-100 text-gray-800'}`}>{feedback.wouldRecommend ? feedback.wouldRecommend : '-'}</span>
                    </TableCell>
                    <TableCell>{feedback.discoveryMethods.join(', ')}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate hover:whitespace-normal hover:text-clip hover:overflow-visible">
                        {feedback.additionalComments || '-'}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No feedback data found matching your criteria
            </div>
          )}

          {/* Data Summary */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredData.length} of {feedbackData.length} total entries
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackReport;