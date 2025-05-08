import React from 'react';
import { useRequestStore } from '../store/request-store';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Form, FormField, FormLabel, FormControl } from './ui/form';
import { Input } from './ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Header } from './header';
import { useNavigate } from 'react-router-dom';
import { ProjectData } from '../types';

const projectData: ProjectData = {
  project_details: {
      project_description: {
          description: "Delivery of cement",
          job_info: null,
          job_owner: null,
          job_type: null,
          large_hills_or_slopes: null
      },
      area_of_project: {
          length: "",
          width: "",
          depth: ""
      }
  },
  location: [
      {
          address: "New York City",
          start_date: "2025-02-03",
          end_date: null,
          time_slots: null,
          truck_spacing: "",
          delivery_rate: null,
          other_info: null,
          products: [
              {
                  id: null,
                  name: "Type I cement",
                  qty: 2,
                  uom: "tons",
                  product_specific_comments: null
              }
          ]
      }
  ],
  contact_info: {
      name: null,
      phone: "",
      email: null
  },
  comments: null,
  completed: false
}

export function RequestPage() {
  const { 
    // projectData, 
    updateLocation, 
    addLocation, 
    removeLocation, 
    addProduct, 
    removeProduct, 
    updateProjectDetails, 
    updateContactInfo, 
    updateComments 
  } = useRequestStore();
  
  const navigate = useNavigate();

  // Redirect if no project data from store
  if (!projectData) {
    return (
      <div className="flex flex-col h-screen bg-gray-100">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h1 className="text-2xl font-bold mb-4">No project data available</h1>
            <p className="mb-4">Please complete a conversation to generate project data.</p>
            <Button onClick={() => navigate('/')}>
              Return to Chat
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleSendRequest = () => {
    // Logic for sending request would be implemented here
    alert('Request sending functionality to be implemented.');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      
      <div className="flex-1 p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Request Form</h1>
          
          <div className="space-y-6">
            {/* Project Details */}
            <Accordion type="single" collapsible defaultValue="project-details">
              <AccordionItem value="project-details">
                <AccordionTrigger className="text-lg font-medium">Project Details</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <h3 className="font-semibold">Project Description</h3>
                    
                    <Form>
                      <div className="space-y-4">
                        <FormField name="description">
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input 
                              value={projectData.project_details?.project_description?.description ?? ""}
                              onChange={(e) => {
                                updateProjectDetails({
                                  ...projectData.project_details,
                                  project_description: {
                                    ...projectData.project_details?.project_description,
                                    description: e.target.value
                                  }
                                });
                              }}
                            />
                          </FormControl>
                        </FormField>
                        
                        <FormField name="job_owner">
                          <FormLabel>Job Owner</FormLabel>
                          <FormControl>
                            <Input 
                              value={projectData.project_details?.project_description?.job_owner ?? ""}
                              onChange={(e) => {
                                updateProjectDetails({
                                  ...projectData.project_details,
                                  project_description: {
                                    ...projectData.project_details?.project_description,
                                    job_owner: e.target.value
                                  }
                                });
                              }}
                            />
                          </FormControl>
                        </FormField>
                        
                        <FormField name="job_type">
                          <FormLabel>Job Type</FormLabel>
                          <FormControl>
                            <Input 
                              value={projectData.project_details?.project_description?.job_type ?? ''}
                              onChange={(e) => {
                                updateProjectDetails({
                                  ...projectData.project_details,
                                  project_description: {
                                    ...projectData.project_details?.project_description,
                                    job_type: e.target.value || null
                                  }
                                });
                              }}
                            />
                          </FormControl>
                        </FormField>
                      </div>
                    </Form>
                    
                    <h3 className="font-semibold mt-4">Area of Project</h3>
                    
                    <Form>
                      <div className="grid grid-cols-3 gap-4">
                        <FormField name="length">
                          <FormLabel>Length</FormLabel>
                          <FormControl>
                            <Input 
                              value={projectData.project_details?.area_of_project?.length || ''}
                              onChange={(e) => {
                                updateProjectDetails({
                                  ...projectData.project_details,
                                  area_of_project: {
                                    ...projectData.project_details?.area_of_project,
                                    length: e.target.value
                                  }
                                });
                              }}
                            />
                          </FormControl>
                        </FormField>
                        
                        <FormField name="width">
                          <FormLabel>Width</FormLabel>
                          <FormControl>
                            <Input 
                              value={projectData.project_details?.area_of_project?.width || ''}
                              onChange={(e) => {
                                updateProjectDetails({
                                  ...projectData.project_details,
                                  area_of_project: {
                                    ...projectData.project_details?.area_of_project,
                                    width: e.target.value
                                  }
                                });
                              }}
                            />
                          </FormControl>
                        </FormField>
                        
                        <FormField name="depth">
                          <FormLabel>Depth</FormLabel>
                          <FormControl>
                            <Input 
                              value={projectData.project_details?.area_of_project?.depth || ''}
                              onChange={(e) => {
                                updateProjectDetails({
                                  ...projectData.project_details,
                                  area_of_project: {
                                    ...projectData.project_details?.area_of_project,
                                    depth: e.target.value
                                  }
                                });
                              }}
                            />
                          </FormControl>
                        </FormField>
                      </div>
                    </Form>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            {/* Locations */}
            <Accordion type="single" collapsible defaultValue="locations">
              <AccordionItem value="locations">
                <AccordionTrigger className="text-lg font-medium">Locations</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {projectData.location.map((location: any, locationIndex: number) => (
                      <div key={locationIndex} className="border rounded-md p-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold">Location {locationIndex + 1}</h3>
                          {projectData.location.length > 1 && (
                            <Button
                              onClick={() => removeLocation(locationIndex)}
                              variant="destructive"
                              size="sm"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          )}
                        </div>
                        
                        <Form>
                          <div className="space-y-4">
                            <FormField name={`address-${locationIndex}`}>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input 
                                  value={location.address || ''}
                                  onChange={(e) => {
                                    updateLocation(locationIndex, {
                                      ...location,
                                      address: e.target.value
                                    });
                                  }}
                                />
                              </FormControl>
                            </FormField>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <FormField name={`start-date-${locationIndex}`}>
                                <FormLabel>Start Date</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="date"
                                    value={location.start_date || ''}
                                    onChange={(e) => {
                                      updateLocation(locationIndex, {
                                        ...location,
                                        start_date: e.target.value
                                      });
                                    }}
                                  />
                                </FormControl>
                              </FormField>
                              
                              <FormField name={`end-date-${locationIndex}`}>
                                <FormLabel>End Date</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="date"
                                    value={location.end_date ?? ''}
                                    onChange={(e) => {
                                      updateLocation(locationIndex, {
                                        ...location,
                                        end_date: e.target.value || null
                                      });
                                    }}
                                  />
                                </FormControl>
                              </FormField>
                            </div>
                            
                            <FormField name={`truck-spacing-${locationIndex}`}>
                              <FormLabel>Truck Spacing</FormLabel>
                              <FormControl>
                                <Input 
                                  value={location.truck_spacing || ''}
                                  onChange={(e) => {
                                    updateLocation(locationIndex, {
                                      ...location,
                                      truck_spacing: e.target.value
                                    });
                                  }}
                                />
                              </FormControl>
                            </FormField>
                          </div>
                        </Form>
                        
                        <h4 className="font-semibold mt-4">Products</h4>
                        
                        <div className="space-y-3">
                          {(location.products || []).map((product: any, productIndex: number) => (
                            <div key={productIndex} className="border rounded p-3 space-y-3">
                              <div className="flex justify-between items-center">
                                <h5 className="font-medium">Product {productIndex + 1}</h5>
                                {(location.products || []).length > 1 && (
                                  <Button
                                    onClick={() => removeProduct(locationIndex, productIndex)}
                                    variant="destructive"
                                    size="sm"
                                  >
                                    <Trash2 className="h-3 w-3 mr-1" />
                                    Remove
                                  </Button>
                                )}
                              </div>
                              
                              <Form>
                                <div className="grid grid-cols-2 gap-3">
                                  <FormField name={`product-name-${locationIndex}-${productIndex}`}>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                      <Input 
                                        value={product.name || ''}
                                        onChange={(e) => {
                                          const newProducts = [...location.products];
                                          newProducts[productIndex] = {
                                            ...product,
                                            name: e.target.value
                                          };
                                          updateLocation(locationIndex, {
                                            ...location,
                                            products: newProducts
                                          });
                                        }}
                                      />
                                    </FormControl>
                                  </FormField>
                                  
                                  <FormField name={`product-qty-${locationIndex}-${productIndex}`}>
                                    <FormLabel>Quantity</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="number"
                                        value={product.qty?.toString() || '0'}
                                        onChange={(e) => {
                                          const newProducts = [...location.products];
                                          newProducts[productIndex] = {
                                            ...product,
                                            qty: parseInt(e.target.value) || 0
                                          };
                                          updateLocation(locationIndex, {
                                            ...location,
                                            products: newProducts
                                          });
                                        }}
                                      />
                                    </FormControl>
                                  </FormField>
                                  
                                  <FormField name={`product-uom-${locationIndex}-${productIndex}`}>
                                    <FormLabel>UOM</FormLabel>
                                    <FormControl>
                                      <Input 
                                        value={product.uom || ''}
                                        onChange={(e) => {
                                          const newProducts = [...location.products];
                                          newProducts[productIndex] = {
                                            ...product,
                                            uom: e.target.value
                                          };
                                          updateLocation(locationIndex, {
                                            ...location,
                                            products: newProducts
                                          });
                                        }}
                                      />
                                    </FormControl>
                                  </FormField>
                                  
                                  <FormField name={`product-comments-${locationIndex}-${productIndex}`}>
                                    <FormLabel>Comments</FormLabel>
                                    <FormControl>
                                      <Input 
                                        value={product.product_specific_comments ?? ''}
                                        onChange={(e) => {
                                          const newProducts = [...location.products];
                                          newProducts[productIndex] = {
                                            ...product,
                                            product_specific_comments: e.target.value || null
                                          };
                                          updateLocation(locationIndex, {
                                            ...location,
                                            products: newProducts
                                          });
                                        }}
                                      />
                                    </FormControl>
                                  </FormField>
                                </div>
                              </Form>
                            </div>
                          ))}
                          
                          <Button 
                            onClick={() => {
                              addProduct(locationIndex, {
                                id: null,
                                name: '',
                                qty: 0,
                                uom: '',
                                product_specific_comments: null
                              });
                            }}
                            variant="outline"
                            className="mt-2"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Product
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      onClick={() => {
                        addLocation({
                          address: '',
                          start_date: '',
                          end_date: null,
                          time_slots: null,
                          truck_spacing: '',
                          delivery_rate: null,
                          other_info: null,
                          products: [{
                            id: null,
                            name: '',
                            qty: 0,
                            uom: '',
                            product_specific_comments: null
                          }]
                        });
                      }}
                      variant="outline"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Location
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            {/* Contact Information */}
            <Accordion type="single" collapsible defaultValue="contact-info">
              <AccordionItem value="contact-info">
                <AccordionTrigger className="text-lg font-medium">Contact Information</AccordionTrigger>
                <AccordionContent>
                  <Form>
                    <div className="space-y-4">
                      <FormField name="contact_name">
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input 
                            value={projectData.contact_info?.name ?? ''}
                            onChange={(e) => {
                              updateContactInfo({
                                ...projectData.contact_info,
                                name: e.target.value || null
                              });
                            }}
                          />
                        </FormControl>
                      </FormField>
                      
                      <FormField name="phone">
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input 
                            value={projectData.contact_info?.phone || ''}
                            onChange={(e) => {
                              updateContactInfo({
                                ...projectData.contact_info,
                                phone: e.target.value
                              });
                            }}
                          />
                        </FormControl>
                      </FormField>
                      
                      <FormField name="email">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            type="email"
                            value={projectData.contact_info?.email ?? ''}
                            onChange={(e) => {
                              updateContactInfo({
                                ...projectData.contact_info,
                                email: e.target.value || null
                              });
                            }}
                          />
                        </FormControl>
                      </FormField>
                    </div>
                  </Form>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            {/* Comments */}
            <Accordion type="single" collapsible defaultValue="comments">
              <AccordionItem value="comments">
                <AccordionTrigger className="text-lg font-medium">Additional Comments</AccordionTrigger>
                <AccordionContent>
                  <Form>
                    <FormField name="comments">
                      <FormLabel>Comments</FormLabel>
                      <FormControl>
                        <Input
                          value={projectData.comments ?? ''}
                          onChange={(e) => updateComments(e.target.value || null)}
                          className="w-full min-h-[100px]"
                        />
                      </FormControl>
                    </FormField>
                  </Form>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <div className="flex justify-center pt-6">
              <Button onClick={handleSendRequest}>
                Send Request
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}