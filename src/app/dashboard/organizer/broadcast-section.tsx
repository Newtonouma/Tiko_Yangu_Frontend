      {/* Broadcast Marketing Section */}
      {activeTab === 'broadcast' && (
        <div className="space-y-6">
          <div className="bg-[#1A1A1A] rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Broadcast Center</h2>
              <div className="text-sm text-gray-400">
                Send messages to all your customers across all events
              </div>
            </div>

            {/* Broadcast Mode Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Broadcast Mode
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="broadcastMode"
                    value="all"
                    checked={broadcastMode === 'all'}
                    onChange={(e) => setBroadcastMode(e.target.value as 'all' | 'selected')}
                    className="mr-2"
                  />
                  <span className="text-white">All customers</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="broadcastMode"
                    value="selected"
                    checked={broadcastMode === 'selected'}
                    onChange={(e) => setBroadcastMode(e.target.value as 'all' | 'selected')}
                    className="mr-2"
                  />
                  <span className="text-white">Selected customers</span>
                </label>
              </div>
            </div>

            {/* Customer List (only show if selected mode) */}
            {broadcastMode === 'selected' && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-white">Your Customers</h3>
                  <ActionButton
                    onClick={handleSelectAllBroadcastCustomers}
                    variant="secondary"
                    size="sm"
                  >
                    {selectedBroadcastCustomers.length === filteredBroadcastCustomers.length ? 'Deselect All' : 'Select All'}
                  </ActionButton>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4 max-h-64 overflow-y-auto">
                  {filteredBroadcastCustomers.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">No customers found</p>
                  ) : (
                    <div className="space-y-2">
                      {filteredBroadcastCustomers.map((customer) => (
                        <label key={customer.id} className="flex items-center p-2 hover:bg-gray-700 rounded cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedBroadcastCustomers.includes(customer.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedBroadcastCustomers([...selectedBroadcastCustomers, customer.id]);
                              } else {
                                setSelectedBroadcastCustomers(selectedBroadcastCustomers.filter(id => id !== customer.id));
                              }
                            }}
                            className="mr-3"
                            aria-label={`Select customer ${customer.name}`}
                          />
                          <div className="flex-1">
                            <div className="font-medium text-white">{customer.name}</div>
                            <div className="text-sm text-gray-400">{customer.email}</div>
                            <div className="text-xs text-gray-500">
                              {customer.ticketCount} tickets • KES {customer.totalSpent.toLocaleString()}
                              {customer.events && customer.events.length > 0 && (
                                <span> • Events: {customer.events.slice(0, 2).join(', ')}{customer.events.length > 2 ? '...' : ''}</span>
                              )}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Message Composition */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Message Type
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="broadcastType"
                      value="email"
                      checked={broadcastMessage.type === 'email'}
                      onChange={(e) => setBroadcastMessage({ ...broadcastMessage, type: e.target.value as 'email' | 'sms' })}
                      className="mr-2"
                    />
                    <span className="text-white">Email</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="broadcastType"
                      value="sms"
                      checked={broadcastMessage.type === 'sms'}
                      onChange={(e) => setBroadcastMessage({ ...broadcastMessage, type: e.target.value as 'email' | 'sms' })}
                      className="mr-2"
                    />
                    <span className="text-white">SMS</span>
                  </label>
                </div>
              </div>

              {broadcastMessage.type === 'email' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="broadcastSubject">
                    Email Subject
                  </label>
                  <input
                    id="broadcastSubject"
                    type="text"
                    value={broadcastMessage.subject}
                    onChange={(e) => setBroadcastMessage({ ...broadcastMessage, subject: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email subject"
                    required
                    aria-describedby="broadcastSubjectHelp"
                  />
                  <p id="broadcastSubjectHelp" className="text-xs text-gray-400 mt-1">Required for email messages</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="broadcastMessage">
                  Message
                </label>
                <textarea
                  id="broadcastMessage"
                  value={broadcastMessage.message}
                  onChange={(e) => setBroadcastMessage({ ...broadcastMessage, message: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                  placeholder={`Enter your ${broadcastMessage.type} message...`}
                  required
                  aria-describedby="broadcastMessageHelp"
                />
                <p id="broadcastMessageHelp" className="text-xs text-gray-400 mt-1">
                  This message will be sent to {broadcastMode === 'all' ? 'all your customers' : `${selectedBroadcastCustomers.length} selected customers`}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-400">
                  {broadcastMode === 'all' ? (
                    `Will send to all ${broadcastCustomers.length} customers`
                  ) : (
                    `Will send to ${selectedBroadcastCustomers.length} selected customers`
                  )}
                </div>
                <ActionButton
                  onClick={sendBroadcastMessage}
                  variant="primary"
                  disabled={sendingBroadcast || 
                    !broadcastMessage.message.trim() || 
                    (broadcastMessage.type === 'email' && !broadcastMessage.subject.trim()) ||
                    (broadcastMode === 'selected' && selectedBroadcastCustomers.length === 0)
                  }
                >
                  {sendingBroadcast ? 'Sending...' : `Send ${broadcastMessage.type.toUpperCase()} Broadcast`}
                </ActionButton>
              </div>
            </div>
          </div>
        </div>
      )}